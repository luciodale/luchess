import { beforeEach, describe, expect, test } from "vitest";
import { ChessBoard } from "../Chess";
import { type TChessBoard, type THistory, defaultState } from "../constants";
import { validatePawnPosition } from "./pawn";
import { setAllPiecesToNull } from "./shared";

describe("Pawn Movement and Capture Tests", () => {
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

	test("White pawn single step forward", () => {
		Chess.setFreeMode({ e2: "wp" });
		const result = validatePawnPosition(
			"wp",
			"e2",
			null,
			"e3",
			[],
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · ♙ · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · ♙ · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("White pawn double step forward from starting position", () => {
		Chess.setFreeMode({ e2: "wp" });
		const result = validatePawnPosition(
			"wp",
			"e2",
			null,
			"e4",
			[],
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · ♙ · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
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

		expect(result.valid).toBe(true);
	});

	test("White pawn invalid double step from non-starting position", () => {
		Chess.setFreeMode({ e3: "wp" });
		const result = validatePawnPosition(
			"wp",
			"e3",
			null,
			"e5",
			[],
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · ♙ · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position: (Invalid move)
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · ♙ · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(false);
		expect(result.message).toBe("Invalid pawn move");
	});

	test("Black pawn single step forward", () => {
		Chess.setFreeMode({ e7: "bp" });
		const result = validatePawnPosition(
			"bp",
			"e7",
			null,
			"e6",
			[],
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · ♟ · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · ♟ · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("Black pawn double step forward from starting position", () => {
		Chess.setFreeMode({ e7: "bp" });
		const result = validatePawnPosition(
			"bp",
			"e7",
			null,
			"e5",
			[],
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · ♟ · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · ♟ · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("Black pawn invalid double step from non-starting position", () => {
		Chess.setFreeMode({ e6: "bp" });
		const result = validatePawnPosition(
			"bp",
			"e6",
			null,
			"e4",
			[],
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · ♟ · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position: (Invalid move)
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♟ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(false);
		expect(result.message).toBe("Invalid pawn move");
	});

	test("White pawn capture to the right", () => {
		Chess.setFreeMode({ e4: "wp", f5: "bp" });
		const result = validatePawnPosition(
			"wp",
			"e4",
			"bp",
			"f5",
			[],
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · ♟ · ·
    4 · · · · ♙ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · ♙ · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("White pawn capture to the left", () => {
		Chess.setFreeMode({ e4: "wp", d5: "bp" });
		const result = validatePawnPosition(
			"wp",
			"e4",
			"bp",
			"d5",
			[],
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · ♟ · · · ·
    4 · · · · ♙ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · ♙ · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("Black pawn capture to the right", () => {
		Chess.setFreeMode({ e5: "bp", f4: "wp" });
		const result = validatePawnPosition(
			"bp",
			"e5",
			"wp",
			"f4",
			[],
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · ♟ · · ·
    4 · · · · · ♙ · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · ♟ · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("Black pawn capture to the left", () => {
		Chess.setFreeMode({ e5: "bp", d4: "wp" });
		const result = validatePawnPosition(
			"bp",
			"e5",
			"wp",
			"d4",
			[],
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · ♟ · · ·
    4 · · · ♙ · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · ♟ · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
	});

	test("White pawn en passant capture", () => {
		Chess.setFreeMode({ e5: "wp", d5: "bp" });
		const history = [
			{
				piece: "bp",
				from: "d7",
				to: "d5",
			},
		] satisfies THistory;
		const result = validatePawnPosition(
			"wp",
			"e5",
			null,
			"d6",
			history,
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · ♟ ♙ · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · ♙ · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
		expect(result.specialMove?.type).toBe("enPassant");
		expect(result.specialMove?.destinationPieceSquare).toBe("d5");
	});

	test("White pawn en passant capture wrong side", () => {
		Chess.setFreeMode({ e5: "wp", d5: "bp" });
		const history = [
			{
				piece: "bp",
				from: "d7",
				to: "d5",
			},
		] satisfies THistory;
		const result = validatePawnPosition(
			"wp",
			"e5",
			null,
			"f6",
			history,
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · ♟ ♙ · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position: (Invalid move)
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · ♙ · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(false);
	});

	test("Black pawn en passant capture", () => {
		Chess.setFreeMode({ e4: "bp", f4: "wp" });
		const history = [{ piece: "wp", from: "f2", to: "f4" }] satisfies THistory;
		const result = validatePawnPosition(
			"bp",
			"e4",
			null,
			"f3",
			history,
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♟ ♙ · ·
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
    3 · · · · · ♟ · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(true);
		expect(result.specialMove?.type).toBe("enPassant");
		expect(result.specialMove?.destinationPieceSquare).toBe("f4");
	});

	test("Black pawn en passant capture wrong side", () => {
		Chess.setFreeMode({ e4: "bp", f4: "wp" });
		const history = [{ piece: "wp", from: "f2", to: "f4" }] satisfies THistory;
		const result = validatePawnPosition(
			"bp",
			"e4",
			null,
			"d3",
			history,
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♟ ♙ · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position: (Invalid move)
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · ♟ · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(false);
	});

	test("Invalid pawn move: backwards", () => {
		Chess.setFreeMode({ e4: "wp", b4: "bp" });
		const result1 = validatePawnPosition(
			"wp",
			"e4",
			null,
			"e3",
			[],
			Chess.board,
		);

		const result2 = validatePawnPosition(
			"bp",
			"b4",
			null,
			"b5",
			[],
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · ♟ · · ♙ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position: (Invalid move)
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · ♟ · · · · · ·
    4 · · · · · · · ·
    3 · · · · ♙ · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result1.valid).toBe(false);
		expect(result1.message).toBe("Invalid pawn move");
		expect(result2.valid).toBe(false);
		expect(result2.message).toBe("Invalid pawn move");
	});

	test("Invalid pawn move: sideways", () => {
		Chess.setFreeMode({ e4: "wp", f4: "bp" });
		const result1 = validatePawnPosition(
			"wp",
			"e4",
			null,
			"f4",
			[],
			Chess.board,
		);

		const result2 = validatePawnPosition(
			"bp",
			"b4",
			null,
			"c4",
			[],
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · ♟ · · ♙ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position: (Invalid move)
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · ♟ · · ♙ · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result1.valid).toBe(false);
		expect(result1.message).toBe("Wrong direction for capture");
		expect(result2.valid).toBe(false);
		expect(result2.message).toBe("Wrong direction for capture");
	});

	test("Invalid pawn capture: no piece to capture", () => {
		Chess.setFreeMode({ e4: "wp" });
		const result = validatePawnPosition(
			"wp",
			"e4",
			null,
			"f5",
			[],
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♙ · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position: (Invalid move)
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · ♙ · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(false);
		expect(result.message).toBe("No piece to capture");
	});

	test("Invalid en passant: not immediately after double step", () => {
		Chess.setFreeMode({ e5: "wp", d5: "bp" });
		const history = [
			{
				piece: "bp",
				from: "d7",
				to: "d5",
			},
			{
				piece: "wn",
				from: "g1",
				to: "f3",
			},
		] satisfies THistory;
		const result = validatePawnPosition(
			"wp",
			"e5",
			null,
			"d6",
			history,
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · ♟ ♙ · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position: (Invalid move)
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · ♙ · · · ·
    5 · · · ♟ · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(false);
		expect(result.message).toBe("No piece to capture");
	});

	test("White pawn blocked from double step by piece on first square", () => {
		Chess.setFreeMode({
			e2: "wp",
			e3: "bp",
		});
		const result = validatePawnPosition(
			"wp",
			"e2",
			null,
			"e4",
			[],
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · ♟ · · ·
    2 · · · · ♙ · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position: (Invalid move)
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · · · · ·
    5 · · · · · · · ·
    4 · · · · ♙ · · ·
    3 · · · · ♟ · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(false);
		expect(result.message).toBe("Path is blocked");
	});

	test("Black pawn blocked from double step by piece on first square", () => {
		Chess.setFreeMode({
			e7: "bp",
			e6: "wp",
		});
		const result = validatePawnPosition(
			"bp",
			"e7",
			null,
			"e5",
			[],
			Chess.board,
		);

		/*
    Initial position:
    8 · · · · · · · ·
    7 · · · · ♟ · · ·
    6 · · · · ♙ · · ·
    5 · · · · · · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h

    Final position: (Invalid move)
    8 · · · · · · · ·
    7 · · · · · · · ·
    6 · · · · ♙ · · ·
    5 · · · · ♟ · · ·
    4 · · · · · · · ·
    3 · · · · · · · ·
    2 · · · · · · · ·
    1 · · · · · · · ·
      a b c d e f g h
    */

		expect(result.valid).toBe(false);
		expect(result.message).toBe("Path is blocked");
	});
});
