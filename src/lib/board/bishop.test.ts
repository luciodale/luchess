import { beforeEach, describe, expect, test } from "vitest";
import { ChessBoard } from "../Chess";
import { type TChessBoard, defaultState } from "../constants";
import { validateBishopPosition } from "./bishop";
import { setAllPiecesToNull } from "./shared";

describe("Bishop Movement Tests", () => {
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

	test("Bishop moves diagonally: up-right", () => {
		Chess.setFreeMode({ e4: "wb" });
		const result = validateBishopPosition("e4", "h7", Chess.board);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♗ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ♗
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

	test("Bishop moves diagonally: up-left", () => {
		Chess.setFreeMode({ e4: "wb" });
		const result = validateBishopPosition("e4", "b7", Chess.board);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♗ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · ♗ · · · · · ·
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

	test("Bishop moves diagonally: down-right", () => {
		Chess.setFreeMode({ e4: "wb" });
		const result = validateBishopPosition("e4", "h1", Chess.board);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♗ · · ·
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
    2 · · · · · · · ·
    1 · · · · · · · ♗
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("Bishop moves diagonally: down-left", () => {
		Chess.setFreeMode({ e4: "wb" });
		const result = validateBishopPosition("e4", "b1", Chess.board);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♗ · · ·
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
    2 · · · · · · · ·
    1 · ♗ · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("Invalid bishop move: horizontal", () => {
		Chess.setFreeMode({ e4: "wb" });
		const result = validateBishopPosition("e4", "h4", Chess.board);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♗ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position: (Invalid move)
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ♗
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(false);
		expect(result.message).toBe("Bishop can only move diagonally");
	});

	test("Invalid bishop move: vertical", () => {
		Chess.setFreeMode({ e4: "wb" });
		const result = validateBishopPosition("e4", "e8", Chess.board);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♗ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position: (Invalid move)
    8 · · · · ♗ · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(false);
		expect(result.message).toBe("Bishop can only move diagonally");
	});

	test("Bishop cannot jump over pieces", () => {
		Chess.setFreeMode({ e4: "wb", f5: "wp" });
		const result = validateBishopPosition("e4", "g6", Chess.board);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · ♙ · ·
    4 · · · · ♗ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position: (Invalid move)
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · ♗ ·
    5 · · · · · ♙ · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(false);
		expect(result.message).toBe("Bishop cannot jump over pieces");
	});

	test("Bishop can capture opponent's piece", () => {
		Chess.setFreeMode({ e4: "wb", g6: "bp" });
		const result = validateBishopPosition("e4", "g6", Chess.board);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · ♟ ·
    5 · · · · · · · ·
    4 · · · · ♗ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · ♗ ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("Bishop can move multiple squares", () => {
		Chess.setFreeMode({ a1: "wb" });
		const result = validateBishopPosition("a1", "h8", Chess.board);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 ♗ · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ♗
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
