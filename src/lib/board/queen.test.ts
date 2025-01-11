import { beforeEach, describe, expect, test } from "vitest";
import { ChessBoard } from "../Chess";
import { type TChessBoard, defaultState } from "../constants";
import { validateQueenPosition } from "./queen";
import { setAllPiecesToNull } from "./shared";

describe("Queen Movement Tests", () => {
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

	test("Queen moves horizontally: right", () => {
		Chess.setFreeMode({ e4: "wq" });
		const result = validateQueenPosition("e4", "h4", Chess.board);

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · ♕ · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h

        Final position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · · · · ♕
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        */

		expect(result.valid).toBe(true);
	});

	test("Queen moves vertically: up", () => {
		Chess.setFreeMode({ e4: "wq" });
		const result = validateQueenPosition("e4", "e8", Chess.board);

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · ♕ · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h

        Final position:
        8 · · · · ♕ · · ·
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

	test("Queen moves diagonally: up-right", () => {
		Chess.setFreeMode({ e4: "wq" });
		const result = validateQueenPosition("e4", "h7", Chess.board);

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · ♕ · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h

        Final position:
        8 · · · · · · · ·
        7 · · · · · · · ♕
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

	test("Invalid queen move: knight-like", () => {
		Chess.setFreeMode({ e4: "wq" });
		const result = validateQueenPosition("e4", "f6", Chess.board);

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · ♕ · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h

        Final position: (Invalid move)
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · ♕ · ·
        5 · · · · · · · ·
        4 · · · · · · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        */

		expect(result.valid).toBe(false);
		expect(result.message).toBe("Invalid queen move");
	});

	test("Queen cannot jump over pieces (horizontal)", () => {
		Chess.setFreeMode({ e4: "wq", g4: "wp" });
		const result = validateQueenPosition("e4", "h4", Chess.board);

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · ♕ · ♙ ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h

        Final position: (Invalid move)
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · · · ♙ ♕
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        */

		expect(result.valid).toBe(false);
	});

	test("Queen cannot jump over pieces (diagonal)", () => {
		Chess.setFreeMode({ e4: "wq", f5: "wp" });
		const result = validateQueenPosition("e4", "g6", Chess.board);

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · ♙ · ·
        4 · · · · ♕ · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h

        Final position: (Invalid move)
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · ♕ ·
        5 · · · · · ♙ · ·
        4 · · · · · · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        */

		expect(result.valid).toBe(false);
	});

	test("Queen can capture opponent's piece", () => {
		Chess.setFreeMode({ e4: "wq", h7: "bp" });
		const result = validateQueenPosition("e4", "h7", Chess.board);

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ♟
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · · · ♕ · · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h

        Final position:
        8 · · · · · · · ·
        7 · · · · · · · ♕
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

	test("Long distance diagonal move with multiple blocking pieces", () => {
		Chess.setFreeMode({
			a1: "wq",
			c3: "wp",
			d4: "bp",
			f6: "wp",
		});
		const result = validateQueenPosition("a1", "h8", Chess.board);

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · ♙ · ·
        5 · · · · · · · ·
        4 · · · ♟ · · · ·
        3 · · ♙ · · · · ·
        2 · · · · · · · ·
        1 ♕ · · · · · · ·
          a b c d e f g h

        Final position: (Invalid move)
        8 · · · · · · · ♕
        7 · · · · · · · ·
        6 · · · · · ♙ · ·
        5 · · · · · · · ·
        4 · · · ♟ · · · ·
        3 · · ♙ · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        */

		expect(result.valid).toBe(false);
	});

	test("Long distance horizontal move with multiple blocking pieces", () => {
		Chess.setFreeMode({
			a4: "wq",
			c4: "wp",
			f4: "bp",
		});
		const result = validateQueenPosition("a4", "h4", Chess.board);

		/*
        Initial position:
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 ♕ · ♙ · · ♟ · ·
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        
        Final position: (Invalid move)
        8 · · · · · · · ·
        7 · · · · · · · ·
        6 · · · · · · · ·
        5 · · · · · · · ·
        4 · · ♙ · · ♟ · ♕
        3 · · · · · · · ·
        2 · · · · · · · ·
        1 · · · · · · · ·
          a b c d e f g h
        */

		expect(result.valid).toBe(false);
	});
});
