import { beforeEach, describe, expect, test } from "vitest";
import { ChessBoard } from "../Chess";
import { type TChessBoard, defaultState } from "../constants";
import {
	setAllPiecesToNull,
	validateKingCheck,
	validateTurnAndSameColorCapture,
} from "./shared";

describe("Shared Validation", () => {
	let Chess: ChessBoard;
	let store: TChessBoard;

	beforeEach(() => {
		store = defaultState;
		const getBoardState = () => store;
		const setBoardState = (newState: TChessBoard) => {
			store = newState;
		};
		Chess = new ChessBoard({
			getBoardState,
			setBoardState,
		});
		setAllPiecesToNull(Chess);
	});

	test("Wrong turn color", () => {
		const e4 = "wp";
		Chess.setFreeMode({
			e4,
		});

		const piece = e4;
		// It's black's turn, but a white piece tries to move
		const result = validateTurnAndSameColorCapture({
			piece,
			toPiece: null,
			currentColor: "b",
		});

		/*
		8 · · · · · · · ·
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · · · ·
		4 · · · · ♙ · · ·
		3 · · · · · · · ·
		2 · · · · · · · ·
		1 · · · · · · · ·
		  a b c d e f g h
		*/

		expect(result.valid).toBe(false);
		expect(result.message).toBe(
			"It's black's turn. You can't move a white piece.",
		);
	});

	test("Same-color capture", () => {
		const e4 = "wp";
		const f5 = "wp";
		Chess.setFreeMode({
			e4,
		});

		const piece = e4;
		const toPiece = f5;

		const result = validateTurnAndSameColorCapture({
			piece,
			toPiece,
			currentColor: "w",
		});

		/*
		8 · · · · · · · ·
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · ♙ · ·
		4 · · · · ♙ · · ·
		3 · · · · · · · ·
		2 · · · · · · · ·
		1 · · · · · · · ·
		  a b c d e f g h
		*/

		expect(result.valid).toBe(false);
	});

	test("Opposite-color capture is valid under sharedValidation", () => {
		const e4 = "wp";
		const f5 = "bp";

		Chess.setFreeMode({
			e4,
			f5,
		});

		const piece = e4;
		const toPiece = f5;
		const result = validateTurnAndSameColorCapture({
			piece,
			toPiece,
			currentColor: "w",
		});

		/*
		8 · · · · · · · ·
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · ♟ · ·
		4 · · · · ♙ · · ·
		3 · · · · · · · ·
		2 · · · · · · · ·
		1 · · · · · · · ·
		  a b c d e f g h
		*/

		expect(result.valid).toBe(true);
	});

	test("King must move when under check", () => {
		const e1 = "wk";
		const e2 = "wp";
		const h1 = "br"; // black rook placing king in check
		Chess.setFreeMode({
			e1,
			e2,
			h1,
		});

		const pawnPiece = e2;

		const pawnResult = validateKingCheck({
			piece: pawnPiece,
			fromSquare: "e2",
			toSquare: "e3",
			board: Chess.board,
			currentColor: "w",
			history: [],
		});

		/*
		8 · · · · · · · ·
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · · · ·
		4 · · · · · · · ·
		3 · · · · · · · ·
		2 · · · · ♙ · · ·
		1 · · · · ♔ · · ♜
		  a b c d e f g h
		*/

		expect(pawnResult.valid).toBe(false);
	});

	test("Move leaves king under check", () => {
		const e1 = "wk";
		const h2 = "br"; // black rook controlling e2
		Chess.setFreeMode({
			e1,
			h2,
		});

		const kingPiece = e1;
		const kingResult = validateKingCheck({
			piece: kingPiece,
			fromSquare: "e1",
			toSquare: "e2",
			board: Chess.board,
			currentColor: "w",
			history: [],
		});

		/*
		8 · · · · · · · ·
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · · · ·
		4 · · · · · · · ·
		3 · · · · · · · ·
		2 · · · · · · · ♜
		1 · · · · ♔ · · ·
		  a b c d e f g h
		*/

		expect(kingResult.valid).toBe(false);
		expect(kingResult.message).toBe("Move would leave king in check");
	});

	test("Pinned bishop cannot move and expose king to rook", () => {
		Chess.setFreeMode({
			e1: "wk",
			e2: "wb",
			e8: "br",
		});

		const result = validateKingCheck({
			piece: "wb",
			fromSquare: "e2",
			toSquare: "d3",
			board: Chess.board,
			currentColor: "w",
			history: [],
		});

		/*
		8 · · · · ♜ · · ·
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · · · ·
		4 · · · · · · · ·
		3 · · · · · · · ·
		2 · · · · ♗ · · ·
		1 · · · · ♔ · · ·
		  a b c d e f g h
		*/

		expect(result.valid).toBe(false);
		expect(result.message).toBe("Move would leave king in check");
	});

	test("Horizontal discovered check - rook attack from right", () => {
		Chess.setFreeMode({
			e4: "wk",
			f4: "wn",
			h4: "br",
		});
		/*
		8 · · · · · · · ·
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · · · ·
		4 · · · · ♔ ♘ · ♜
		3 · · · · · · · ·
		2 · · · · · · · ·
		1 · · · · · · · ·
		  a b c d e f g h
		*/
		const result = validateKingCheck({
			piece: "wn",
			fromSquare: "f4",
			toSquare: "d5",
			board: Chess.board,
			currentColor: "w",
			history: [],
		});
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Move would leave king in check");
	});

	test("Vertical discovered check - queen attack from above", () => {
		Chess.setFreeMode({
			e1: "wk",
			e2: "wb",
			e8: "bq",
		});
		/*
		8 · · · · ♛ · · ·
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · · · ·
		4 · · · · · · · ·
		3 · · · · · · · ·
		2 · · · · ♗ · · ·
		1 · · · · ♔ · · ·
		  a b c d e f g h
		*/
		const result = validateKingCheck({
			piece: "wb",
			fromSquare: "e2",
			toSquare: "f3",
			board: Chess.board,
			currentColor: "w",
			history: [],
		});
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Move would leave king in check");
	});

	test("Diagonal discovered check - bishop attack from top right", () => {
		Chess.setFreeMode({
			c3: "wk",
			d4: "wp",
			h8: "bb",
		});
		/*
		8 · · · · · · · ♝
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · · · ·
		4 · · · ♙ · · · ·
		3 · · ♔ · · · · ·
		2 · · · · · · · ·
		1 · · · · · · · ·
		  a b c d e f g h
		*/
		const result = validateKingCheck({
			piece: "wp",
			fromSquare: "d4",
			toSquare: "d5",
			board: Chess.board,
			currentColor: "w",
			history: [],
		});
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Move would leave king in check");
	});

	test("Diagonal discovered check - bishop attack from top left", () => {
		Chess.setFreeMode({
			f3: "wk",
			e4: "wn",
			a8: "bb",
		});
		/*
		8 ♝ · · · · · · ·
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · · · ·
		4 · · · · ♘ · · ·
		3 · · · · · ♔ · ·
		2 · · · · · · · ·
		1 · · · · · · · ·
		  a b c d e f g h
		*/
		const result = validateKingCheck({
			piece: "wn",
			fromSquare: "e4",
			toSquare: "g5",
			board: Chess.board,
			currentColor: "w",
			history: [],
		});
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Move would leave king in check");
	});

	test("Multiple discovered checks - queen and bishop", () => {
		Chess.setFreeMode({
			d4: "wk",
			f4: "wn",
			h4: "bq",
			h8: "bb",
		});
		/*
		8 · · · · · · · ♝
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · · · ·
		4 · · · ♔ · ♘ · ♛
		3 · · · · · · · ·
		2 · · · · · · · ·
		1 · · · · · · · ·
		  a b c d e f g h
		*/
		const result = validateKingCheck({
			piece: "wn",
			fromSquare: "f4",
			toSquare: "d3",
			board: Chess.board,
			currentColor: "w",
			history: [],
		});
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Move would leave king in check");
	});
});
