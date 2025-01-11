import { beforeEach, describe, expect, test } from "vitest";
import { ChessBoard } from "../Chess";
import { type TChessBoard, type THistory, defaultState } from "../constants";
import {
	hasInsufficientMaterial,
	isDraw,
	isFiftyMoveRule,
	isThreefoldRepetition,
} from "./draw";
import { isCheckmate, isStalemate, setAllPiecesToNull } from "./shared";

describe("Draw Detection", () => {
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

	test("Insufficient material - King vs King", () => {
		Chess.setFreeMode({
			e1: "wk",
			e8: "bk",
		});

		/*
        Initial position:
        8 · · · · ♚ · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · · · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · ♔ · · ·
          a b c d e f g h
        */

		expect(hasInsufficientMaterial(Chess.board)).toBe(true);
	});

	test("Threefold repetition via knight moves", () => {
		Chess.setFreeMode({
			e1: "wk",
			e8: "bk",
			b1: "wn",
		});

		/*
        Initial position:
        8 · · · · ♚ · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · · · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · ♘ · · ♔ · · ·
          a b c d e f g h
        */

		const history = [
			{ piece: "wn", from: "b1", to: "c3" },
			{ piece: "bk", from: "e8", to: "e7" },
			{ piece: "wn", from: "c3", to: "b1" },
			{ piece: "bk", from: "e7", to: "e8" },
			{ piece: "wn", from: "b1", to: "c3" },
			{ piece: "bk", from: "e8", to: "e7" },
		] satisfies THistory;

		expect(isThreefoldRepetition(Chess.board, history)).toBe(true);
	});

	test("Fifty move rule - No pawn moves or captures", () => {
		Chess.setFreeMode({
			e1: "wk",
			e8: "bk",
			b1: "wn",
		});

		/*
        Initial position:
        8 · · · · ♚ · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · · · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · ♘ · · ♔ · · ·
          a b c d e f g h
        */

		const history = Array(100)
			.fill(null)
			.map((_, i) => ({
				piece: i % 2 === 0 ? "wn" : "bk",
				from: i % 2 === 0 ? "b1" : "e8",
				to: i % 2 === 0 ? "c3" : "e7",
				capture: false,
			})) satisfies THistory;

		expect(isFiftyMoveRule(history)).toBe(true);
	});

	test("Combined draw detection - Insufficient material", () => {
		Chess.setFreeMode({
			e1: "wk",
			e8: "bk",
		});

		/*
        Initial position:
        8 · · · · ♚ · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · · · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · ♔ · · ·
          a b c d e f g h
        */

		expect(isDraw(Chess.board, [])).toBe(true);
	});

	describe("Game End Scenarios", () => {
		test("Stalemate - King trapped in corner by queen", () => {
			Chess.setFreeMode({
				a8: "bk",
				b6: "wq",
				c7: "wk",
			});
			/*
		  Initial position:
		  8 ♚ · · · · · · ·
		  7 · · ♔ · · · · ·
		  6 · ♕ · · · · · ·
		  5 · · · · · · · ·
		  4 · · · · · · · ·
		  3 · · · · · · · ·
		  2 · · · · · · · ·
		  1 · · · · · · · ·
			a b c d e f g h
		  */
			expect(isStalemate(Chess.board, "b", [])).toBe(true);
		});

		test("Stalemate - King surrounded by own pawns", () => {
			Chess.setFreeMode({
				d7: "bp",
				e7: "bk",
				f7: "bp",
				d6: "wn",
				e6: "bp",
				f6: "wn",
				h8: "wq",
				e5: "wp",
				a1: "wk",
			});
			/*
		  Initial position:
		  8 · · · · · · · ♕
		  7 · · · ♟ ♚ ♟ · ·
		  6 · · · ♘ ♟ ♘ · ·
		  5 · · · · ♙ · · ·
		  4 · · · · · · · ·
		  3 · · · · · · · ·
		  2 · · · · · · · ·
		  1 ♔ · · · · · · ·
			a b c d e f g h
		  */
			expect(isStalemate(Chess.board, "b", [])).toBe(true);
		});

		test("Smothered mate - Knight checkmate", () => {
			Chess.setFreeMode({
				h8: "bk",
				g8: "br",
				h7: "bp",
				g7: "bp",
				f7: "wn",
				e6: "wk",
			});
			/*
		  Initial position:
		  8 · · · · · · ♜ ♚
		  7 · · · · · ♘ ♟ ♟
		  6 · · · · ♔ · · ·
		  5 · · · · · · · ·
		  4 · · · · · · · ·
		  3 · · · · · · · ·
		  2 · · · · · · · ·
		  1 · · · · · · · ·
			a b c d e f g h
		  */
			expect(isCheckmate(Chess.board, "b", [])).toBe(true);
		});

		test("Scholar's mate - Queen and bishop checkmate", () => {
			Chess.setFreeMode({
				a8: "bk",
				f7: "bp",
				g7: "bp",
				h7: "bp",
				f3: "wb",
				b7: "wq",
				e1: "wk",
			});
			/*
		  Initial position:
		  8 ♚ · · · · · · ·
		  7 · ♕ · · · ♟ ♟ ♟
		  6 · · · · · · · ·
		  5 · · · · · · · ·
		  4 · · · · · · · ·
		  3 · · · · · ♗ · ·
		  2 · · · · · · · ·
		  1 · · · · ♔ · · ·
			a b c d e f g h
		  */
			expect(isCheckmate(Chess.board, "b", [])).toBe(true);
		});

		test("Back rank mate - Rook checkmate", () => {
			Chess.setFreeMode({
				f8: "bk",
				e7: "bp",
				f7: "bp",
				g7: "bp",
				h8: "wr",
			});
			/*
		  Initial position:
		  8 · · · · · ♚ · ♖
		  7 · · · · ♟ ♟ ♟ ·
		  6 · · · · · · · ·
		  5 · · · · · · · ·
		  4 · · · · · · · ·
		  3 · · · · · · · ·
		  2 · · · · · · · ·
		  1 · · · · · · · ·
			a b c d e f g h
		  */
			expect(isCheckmate(Chess.board, "b", [])).toBe(true);
		});
	});
});
