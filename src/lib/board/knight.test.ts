import { beforeEach, describe, expect, test } from "vitest";
import { ChessBoard } from "../Chess";
import { type TChessBoard, defaultState } from "../constants";
import { validateKnightPosition } from "./knight";
import { setAllPiecesToNull } from "./shared";

describe("Knight Movement Tests", () => {
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

	test("Knight moves in L-shape: 2 up, 1 right", () => {
		Chess.setFreeMode({ e4: "wn" });
		const result = validateKnightPosition("e4", "f6");

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♘ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · ♘ · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("Knight moves in L-shape: 2 up, 1 left", () => {
		Chess.setFreeMode({ e4: "wn" });
		const result = validateKnightPosition("e4", "d6");

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♘ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · ♘ · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("Knight moves in L-shape: 2 down, 1 right", () => {
		Chess.setFreeMode({ e4: "wn" });
		const result = validateKnightPosition("e4", "f2");

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♘ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · ♘ · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("Knight moves in L-shape: 2 down, 1 left", () => {
		Chess.setFreeMode({ e4: "wn" });
		const result = validateKnightPosition("e4", "d2");

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♘ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · ♘ · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("Knight moves in L-shape: 2 right, 1 up", () => {
		Chess.setFreeMode({ e4: "wn" });
		const result = validateKnightPosition("e4", "g5");

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♘ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · ♘ ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("Knight moves in L-shape: 2 right, 1 down", () => {
		Chess.setFreeMode({ e4: "wn" });
		const result = validateKnightPosition("e4", "g3");

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♘ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · ♘ ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("Knight moves in L-shape: 2 left, 1 up", () => {
		Chess.setFreeMode({ e4: "wn" });
		const result = validateKnightPosition("e4", "c5");

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♘ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · ♘ · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("Knight moves in L-shape: 2 left, 1 down", () => {
		Chess.setFreeMode({ e4: "wn" });
		const result = validateKnightPosition("e4", "c3");

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♘ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · ♘ · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("Invalid knight move: 1 square diagonally", () => {
		Chess.setFreeMode({ e4: "wn" });
		const result = validateKnightPosition("e4", "f5");

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♘ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position: (Invalid move)
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · ♘ · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(false);
		expect(result.message).toBe("Knight can only move in an L-shape");
	});

	test("Invalid knight move: 2 squares horizontally", () => {
		Chess.setFreeMode({ e4: "wn" });
		const result = validateKnightPosition("e4", "g4");

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♘ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position: (Invalid move)
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · · ♘ ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(false);
		expect(result.message).toBe("Knight can only move in an L-shape");
	});

	test("Invalid knight move: 2 squares vertically", () => {
		Chess.setFreeMode({ e4: "wn" });
		const result = validateKnightPosition("e4", "e6");

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♘ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position: (Invalid move)
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · ♘ · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(false);
		expect(result.message).toBe("Knight can only move in an L-shape");
	});

	test("Knight can jump over other pieces", () => {
		Chess.setFreeMode({ e4: "wn", e5: "wp", e6: "bp" });
		const result = validateKnightPosition("e4", "f6");

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · ♟ · · ·
    5 · · · · ♙ · · ·
    4 · · · · ♘ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · ♟ ♘ · ·
    5 · · · · ♙ · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("Knight can capture opponent's piece", () => {
		Chess.setFreeMode({ e4: "wn", f6: "bp" });
		const result = validateKnightPosition("e4", "f6");

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · ♟ · ·
    5 · · · · · · · ·
    4 · · · · ♘ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · ♘ · ·
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
