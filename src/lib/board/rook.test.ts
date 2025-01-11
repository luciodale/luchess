import { beforeEach, describe, expect, test } from "vitest";
import { ChessBoard } from "../Chess";
import { type TChessBoard, defaultState } from "../constants";
import { validateRookPosition } from "./rook";
import { setAllPiecesToNull } from "./shared";

describe("Rook Movement Tests", () => {
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

	test("Rook moves horizontally: right", () => {
		Chess.setFreeMode({ e4: "wr" });
		const result = validateRookPosition("e4", "h4", Chess.board);

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · ♖ · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h

        Final position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · · · · ♖
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        */

		expect(result.valid).toBe(true);
	});

	test("Rook moves horizontally: left", () => {
		Chess.setFreeMode({ e4: "wr" });
		const result = validateRookPosition("e4", "a4", Chess.board);

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · ♖ · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h

        Final position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 ♖ · · · · · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        */

		expect(result.valid).toBe(true);
	});

	test("Rook moves vertically: up", () => {
		Chess.setFreeMode({ e4: "wr" });
		const result = validateRookPosition("e4", "e8", Chess.board);

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · ♖ · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h

        Final position:
        8 · · · · ♖ · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · · · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        */

		expect(result.valid).toBe(true);
	});

	test("Invalid rook move: diagonal", () => {
		Chess.setFreeMode({ e4: "wr" });
		const result = validateRookPosition("e4", "h7", Chess.board);

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · ♖ · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h

        Final position: (Invalid move)
        8 · · · · · · · ·
        7 · · · · · · · ♖
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · · · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        */

		expect(result.valid).toBe(false);
		expect(result.message).toBe(
			"Rook can only move horizontally or vertically",
		);
	});

	test("Rook cannot jump over pieces", () => {
		Chess.setFreeMode({ e4: "wr", e6: "wp" });
		const result = validateRookPosition("e4", "e8", Chess.board);

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · ♙ · · ·
        5 · · · · · · · ·
        4 · · · · ♖ · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h

        Final position: (Invalid move)
        8 · · · · ♖ · · ·
        7 · · · · · · · ·
        6 · · · · ♙ · · ·
        5 · · · · · · · ·
        4 · · · · · · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        */

		expect(result.valid).toBe(false);
		expect(result.message).toBe("Rook cannot jump over pieces");
	});

	test("Rook can capture opponent's piece", () => {
		Chess.setFreeMode({ e4: "wr", e7: "bp" });
		const result = validateRookPosition("e4", "e7", Chess.board);

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · ♟ · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · ♖ · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h

        Final position:
        8 · · · · · · · ·
        7 · · · · ♖ · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · · · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        */

		expect(result.valid).toBe(true);
	});

	test("Rook can move multiple squares", () => {
		Chess.setFreeMode({ a1: "wr" });
		const result = validateRookPosition("a1", "a8", Chess.board);

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · · · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 ♖ · · · · · · ·
          a b c d e f g h

        Final position:
        8 ♖ · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · · · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        */

		expect(result.valid).toBe(true);
	});
});
