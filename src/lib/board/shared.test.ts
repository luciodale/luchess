import { beforeEach, describe, expect, test } from "vitest";
import { ChessBoard } from "../Chess";
import { type TChessBoard, defaultState } from "../constants";
import {
	setAllPiecesToNull,
	validateKingCheck,
	validateKingCheckAndPromotion,
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
		Chess.setFreeMode({
			e4: "wp", // White pawn
		});

		// biome-ignore lint/style/noNonNullAssertion: we know it's set
		const piece = Chess.board?.e4!; // "wp"
		// It's black's turn, but a white piece tries to move
		const result = validateTurnAndSameColorCapture({
			piece,
			toPiece: null,
			currentColor: "b",
		});
		expect(result.valid).toBe(false);
		expect(result.message).toBe(
			"It's black's turn. You can't move a white piece.",
		);
	});

	test("Same-color capture", () => {
		Chess.setFreeMode({
			e4: "wp",
			e5: "wp",
		});

		// biome-ignore lint/style/noNonNullAssertion: we know it's set
		const piece = Chess.board.e4!; // "wp"
		// biome-ignore lint/style/noNonNullAssertion: we know it's set
		const toPiece = Chess.board.e5!; // "wp"
		const result = validateTurnAndSameColorCapture({
			piece,
			toPiece,
			currentColor: "w",
		});
		expect(result.valid).toBe(false);
	});

	test("Opposite-color capture is valid under sharedValidation", () => {
		Chess.setFreeMode({
			e4: "wp",
			e5: "bp",
			a1: "wk",
		});

		// biome-ignore lint/style/noNonNullAssertion: we know it's set
		const piece = Chess.board.e4!; // "wp"
		// biome-ignore lint/style/noNonNullAssertion: we know it's set
		const toPiece = Chess.board.e5!; // "bp"
		const result = validateTurnAndSameColorCapture({
			piece,
			toPiece,

			currentColor: "w",
		});

		expect(result.valid).toBe(true);
	});

	test("King must move when under check", () => {
		Chess.setFreeMode({
			e1: "wk",
			e2: "wp",
			h1: "br", // black rook placing king in check
		});

		// Attempt to move the pawn instead of the king
		// biome-ignore lint/style/noNonNullAssertion: we know it's set
		const pawnPiece = Chess.board.e2!; // "wp"
		const pawnResult = validateKingCheck(
			pawnPiece,
			"e2",
			"e3",
			Chess.board,
			"w",
			[],
		);
		expect(pawnResult.valid).toBe(false);
	});

	test("Move leaves king under check", () => {
		Chess.setFreeMode({
			e1: "wk",
			h2: "br", // black rook controlling e2
		});

		// Try moving king into e2 (under rook attack)
		// biome-ignore lint/style/noNonNullAssertion: we know it's set
		const kingPiece = Chess.board.e1!; // "wk"
		const kingResult = validateKingCheck(
			kingPiece,
			"e1",
			"e2",
			Chess.board,
			"w",
			[],
		);
		expect(kingResult.valid).toBe(false);
		expect(kingResult.message).toBe("Move would leave king in check");
	});

	test("Pinned bishop cannot move and expose king to rook", () => {
		Chess.setFreeMode({
			e1: "wk",
			e2: "wb",
			e8: "br",
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
		const result = validateKingCheckAndPromotion({
			piece: "wb",
			fromSquare: "e2",
			toSquare: "d3",
			board: Chess.board,
			currentColor: "w",
			history: [],
		});
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
		const result = validateKingCheckAndPromotion({
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
		const result = validateKingCheckAndPromotion({
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
		const result = validateKingCheckAndPromotion({
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
		const result = validateKingCheckAndPromotion({
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
			e4: "wk",
			f4: "wn",
			h4: "bq",
			h8: "bb",
		});
		/*
		8 · · · · · · · ♝
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · · · ·
		4 · · · · ♔ ♘ · ♛
		3 · · · · · · · ·
		2 · · · · · · · ·
		1 · · · · · · · ·
		  a b c d e f g h
		*/
		const result = validateKingCheckAndPromotion({
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
