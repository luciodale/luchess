import { beforeEach, describe, expect, test } from "vitest";
import { ChessBoard } from "../Chess";
import { type TChessBoard, type THistory, defaultState } from "../constants";
import { validateKingPosition } from "./king";
import { setAllPiecesToNull } from "./shared";

describe("King Movement Tests", () => {
	let Chess: ChessBoard;

	beforeEach(() => {
		let store: TChessBoard = defaultState;
		const getBoardState = () => store;
		const setBoardState = (newState: TChessBoard) => {
			store = newState;
		};

		Chess = new ChessBoard({
			getBoardState: getBoardState,
			setBoardState: setBoardState,
		});

		setAllPiecesToNull(Chess);
	});

	test("Valid king moves in all directions", () => {
		Chess.setFreeMode({ e4: "wk" });

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · ♔ · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        */

		const validMoves = [
			["e4", "e5"], // up
			["e4", "f5"], // up-right
			["e4", "f4"], // right
			["e4", "f3"], // down-right
			["e4", "e3"], // down
			["e4", "d3"], // down-left
			["e4", "d4"], // left
			["e4", "d5"], // up-left
		] as const;

		for (const [from, to] of validMoves) {
			const result = validateKingPosition({
				piece: "wk",
				board: Chess.board,
				fromSquare: from,
				toSquare: to,
				history: [],
			});
			expect(result.valid).toBe(true);
		}
	});

	test("Invalid king move: two squares", () => {
		Chess.setFreeMode({ e4: "wk" });
		const result = validateKingPosition({
			piece: "wk",
			board: Chess.board,
			fromSquare: "e4",
			toSquare: "e6",
			history: [],
		});

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · ♔ · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        */

		expect(result.valid).toBe(false);
		expect(result.message).toBe(
			"King can only move one square in any direction",
		);
	});

	test("Invalid king move: into check", () => {
		Chess.setFreeMode({
			e1: "wk",
			h2: "br", // Rook controlling the e2 square
		});

		/*
        Initial position:
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

		const result = validateKingPosition({
			piece: "wk",
			board: Chess.board,
			fromSquare: "e1",
			toSquare: "e2",
			history: [],
		});

		expect(result.valid).toBe(false);
	});

	test("King can capture attacking piece", () => {
		Chess.setFreeMode({
			e4: "wk",
			f5: "bp",
		});

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · ♟ · ·
        4 · · · · ♔ · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        */

		const result = validateKingPosition({
			piece: "wk",
			board: Chess.board,
			fromSquare: "e4",
			toSquare: "f5",
			history: [],
		});

		expect(result.valid).toBe(true);
	});

	test("King can capture attacking queen while in check", () => {
		Chess.setFreeMode({
			a8: "br",
			b8: "bn",
			c8: "bb",
			d8: null,
			e8: null,
			f8: "bb",
			g8: null,
			h8: "br",
			a7: "bp",
			b7: "bp",
			c7: "bp",
			d7: "wq",
			e7: "bk",
			f7: null,
			g7: "bp",
			h7: "bp",
			a6: null,
			b6: null,
			c6: null,
			d6: null,
			e6: "bp",
			f6: "bn",
			g6: null,
			h6: null,
			a5: null,
			b5: null,
			c5: null,
			d5: null,
			e5: null,
			f5: null,
			g5: "bp",
			h5: null,
			a4: null,
			b4: null,
			c4: "wp",
			d4: null,
			e4: null,
			f4: null,
			g4: null,
			h4: null,
			a3: null,
			b3: null,
			c3: null,
			d3: "bp",
			e3: null,
			f3: null,
			g3: null,
			h3: null,
			a2: "wp",
			b2: "wp",
			c2: null,
			d2: "wp",
			e2: null,
			f2: null,
			g2: "wp",
			h2: "wp",
			a1: "wr",
			b1: "wn",
			c1: "wb",
			d1: null,
			e1: "wk",
			f1: null,
			g1: "wn",
			h1: "wr",
		});

		/*
		Initial position:
		8 ♜ ♞ ♝ · · ♝ · ♜
		7 ♟ ♟ ♟ ♕ ♚ · ♟ ♟
		6 · · · · ♟ ♞ · ·
		5 · · · · · · ♟ ·
		4 · · ♙ · · · · ·
		3 · · · ♟ · · · ·
		2 ♙ ♙ · ♙ · · ♙ ♙
		1 ♖ ♘ ♗ · ♔ · ♘ ♖
		  a b c d e f g h
		*/

		const result = validateKingPosition({
			piece: "bk",
			board: Chess.board,
			fromSquare: "e7",
			toSquare: "d7",
			history: [],
		});

		expect(result.valid).toBe(true);
		expect(result.message).toBeUndefined();
	});

	test("Valid kingside castling", () => {
		Chess.setFreeMode({
			e1: "wk",
			h1: "wr",
		});
		/*
		8 · · · · · · · ·
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · · · ·
		4 · · · · · · · ·
		3 · · · · · · · ·
		2 · · · · · · · ·
		1 · · · · ♔ · · ♖
		  a b c d e f g h
		*/
		const result = validateKingPosition({
			piece: "wk",
			board: Chess.board,
			fromSquare: "e1",
			toSquare: "g1",
			history: [],
		});
		expect(result.valid).toBe(true);
		expect(result.specialMove?.type).toBe("castling");
		expect(result.specialMove?.rookFromSquare).toBe("h1");
		expect(result.specialMove?.rookToSquare).toBe("f1");
	});

	test("Cannot castle through check", () => {
		Chess.setFreeMode({
			e1: "wk",
			h1: "wr",
			f3: "bq", // Controls f1 square
		});
		/*
		8 · · · · · · · ·
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · · · ·
		4 · · · · · · · ·
		3 · · · · · ♛ · ·
		2 · · · · · · · ·
		1 · · · · ♔ · · ♖
		  a b c d e f g h
		*/
		const result = validateKingPosition({
			piece: "wk",
			board: Chess.board,
			fromSquare: "e1",
			toSquare: "g1",
			history: [],
		});
		expect(result.valid).toBe(false);
		expect(result.message).toBe(
			"Cannot castle through or into squares under attack",
		);
	});

	test("Cannot castle after king has moved", () => {
		Chess.setFreeMode({
			e1: "wk",
			h1: "wr",
		});
		const history = [
			{ piece: "wk", from: "e1", to: "f1" },
			{ piece: "wk", from: "f1", to: "e1" },
		] satisfies THistory;

		const result = validateKingPosition({
			piece: "wk",
			board: Chess.board,
			fromSquare: "e1",
			toSquare: "g1",
			history,
		});
		expect(result.valid).toBe(false);
		expect(result.message).toBe("Cannot castle if the king or rook has moved");
	});

	test("Cannot castle with pieces between", () => {
		Chess.setFreeMode({
			e1: "wk",
			f1: "wb", // Blocking piece
			h1: "wr",
		});
		/*
		8 · · · · · · · ·
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · · · ·
		4 · · · · · · · ·
		3 · · · · · · · ·
		2 · · · · · · · ·
		1 · · · · ♔ ♗ · ♖
		  a b c d e f g h
		*/
		const result = validateKingPosition({
			piece: "wk",
			board: Chess.board,
			fromSquare: "e1",
			toSquare: "g1",
			history: [],
		});
		expect(result.valid).toBe(false);
		expect(result.message).toBe(
			"Cannot castle through or into occupied squares",
		);
	});

	test("Cannot castle while in check", () => {
		Chess.setFreeMode({
			e1: "wk",
			h1: "wr",
			e8: "br", // Giving check
		});
		/*
		8 · · · · ♜ · · ·
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · · · ·
		4 · · · · · · · ·
		3 · · · · · · · ·
		2 · · · · · · · ·
		1 · · · · ♔ · · ♖
		  a b c d e f g h
		*/
		const result = validateKingPosition({
			piece: "wk",
			board: Chess.board,
			fromSquare: "e1",
			toSquare: "g1",
			history: [],
		});
		expect(result.valid).toBe(false);
		expect(result.message).toBe(
			"Cannot castle through or into squares under attack",
		);
	});

	test("Cannot castle through check", () => {
		Chess.setFreeMode({
			e1: "wk",
			h1: "wr",
			f8: "br", // Rook controls f1 square
		});
		/*
		8 · · · · · ♜ · ·
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · · · ·
		4 · · · · · · · ·
		3 · · · · · · · ·
		2 · · · · · · · ·
		1 · · · · ♔ · · ♖
		  a b c d e f g h
		*/
		const result = validateKingPosition({
			piece: "wk",
			fromSquare: "e1",
			toSquare: "g1",
			board: Chess.board,
			history: [],
		});
		expect(result.valid).toBe(false);
		expect(result.message).toBe(
			"Cannot castle through or into squares under attack",
		);
	});

	test("Can castle if piece doesn't interfere with king", () => {
		Chess.setFreeMode({
			e1: "wk",
			a1: "wr",
			b8: "br", // Rook controls b1 square
		});
		/*
		8 · ♜ · · · · · ·
		7 · · · · · · · ·
		6 · · · · · · · ·
		5 · · · · · · · ·
		4 · · · · · · · ·
		3 · · · · · · · ·
		2 · · · · · · · ·
		1 ♖ · · · ♔ · · ·
		  a b c d e f g h
		*/
		const result = validateKingPosition({
			piece: "wk",
			fromSquare: "e1",
			toSquare: "c1",
			board: Chess.board,
			history: [],
		});
		expect(result.valid).toBe(true);
	});
});
