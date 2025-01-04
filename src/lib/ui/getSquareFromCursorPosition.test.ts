import { describe, expect, it } from "vitest";
import { getSquareFromCursorPosition } from "./getSquareFromCursorPosition";

describe("getSquareFromCursorPosition", () => {
	const mockBoardNode = {
		getBoundingClientRect: () => ({
			left: 0,
			top: 0,
			width: 800,
			height: 800,
		}),
	} as HTMLElement;

	describe("for w perspective", () => {
		it("should return 'a8' for cursor position at the top-left corner of the board", () => {
			const square = getSquareFromCursorPosition(
				0,
				0,
				mockBoardNode,
				"a6",
				"w",
			);
			expect(square).toBe("a8");
		});

		it("should return 'h8' for cursor position at the top-right corner of the board", () => {
			const square = getSquareFromCursorPosition(
				799,
				0,
				mockBoardNode,
				"a6",
				"w",
			);
			expect(square).toBe("h8");
		});

		it("should return 'a1' for cursor position at the bottom-left corner of the board", () => {
			const square = getSquareFromCursorPosition(
				0,
				799,
				mockBoardNode,
				"a6",
				"w",
			);
			expect(square).toBe("a1");
		});

		it("should return 'h1' for cursor position at the bottom-right corner of the board", () => {
			const square = getSquareFromCursorPosition(
				799,
				799,
				mockBoardNode,
				"a6",
				"w",
			);
			expect(square).toBe("h1");
		});

		it("should return 'e4' for cursor position at the center of the board", () => {
			const square = getSquareFromCursorPosition(
				400,
				400,
				mockBoardNode,
				"a6",
				"w",
			);
			expect(square).toBe("e4");
		});

		it("should return 'e5' for cursor position slightly above and to the right of the center", () => {
			const square = getSquareFromCursorPosition(
				450,
				350,
				mockBoardNode,
				"a6",
				"w",
			);
			expect(square).toBe("e5");
		});

		it("should return 'b7' for cursor position near the top-left quadrant of the board", () => {
			const square = getSquareFromCursorPosition(
				100,
				100,
				mockBoardNode,
				"a6",
				"w",
			);
			expect(square).toBe("b7");
		});

		it("should return 'h1' for cursor position near the bottom-right quadrant of the board", () => {
			const square = getSquareFromCursorPosition(
				700,
				700,
				mockBoardNode,
				"a6",
				"w",
			);
			expect(square).toBe("h1");
		});

		it("should return 'c8' for cursor position near the top-center of the board", () => {
			const square = getSquareFromCursorPosition(
				250,
				50,
				mockBoardNode,
				"a6",
				"w",
			);
			expect(square).toBe("c8");
		});

		it("should return 'f1' for cursor position near the bottom-center of the board", () => {
			const square = getSquareFromCursorPosition(
				550,
				750,
				mockBoardNode,
				"a6",
				"w",
			);
			expect(square).toBe("f1");
		});

		it("should return the initial square 'a6' for cursor position outside the board boundaries", () => {
			const square = getSquareFromCursorPosition(
				-1,
				-3,
				mockBoardNode,
				"a6",
				"w",
			);
			expect(square).toBe("a6");
		});

		it("should return the initial square 'a6' for cursor position far outside the board boundaries", () => {
			const square = getSquareFromCursorPosition(
				900,
				900,
				mockBoardNode,
				"a6",
				"w",
			);
			expect(square).toBe("a6");
		});
	});

	describe("for b perspective", () => {
		it("should return 'h1' for cursor position at the top-left corner of the board", () => {
			const square = getSquareFromCursorPosition(
				0,
				0,
				mockBoardNode,
				"a6",
				"b",
			);
			expect(square).toBe("h1");
		});

		it("should return 'a1' for cursor position at the top-right corner of the board", () => {
			const square = getSquareFromCursorPosition(
				799,
				0,
				mockBoardNode,
				"a6",
				"b",
			);
			expect(square).toBe("a1");
		});

		it("should return 'h8' for cursor position at the bottom-left corner of the board", () => {
			const square = getSquareFromCursorPosition(
				0,
				799,
				mockBoardNode,
				"a6",
				"b",
			);
			expect(square).toBe("h8");
		});

		it("should return 'a8' for cursor position at the bottom-right corner of the board", () => {
			const square = getSquareFromCursorPosition(
				799,
				799,
				mockBoardNode,
				"a6",
				"b",
			);
			expect(square).toBe("a8");
		});

		it("should return 'd5' for cursor position at the center of the board", () => {
			const square = getSquareFromCursorPosition(
				400,
				400,
				mockBoardNode,
				"a6",
				"b",
			);
			expect(square).toBe("d5");
		});

		it("should return 'd4' for cursor position slightly below and to the right of the center", () => {
			const square = getSquareFromCursorPosition(
				450,
				350,
				mockBoardNode,
				"a6",
				"b",
			);
			expect(square).toBe("d4");
		});

		it("should return 'g2' for cursor position near the top-left quadrant of the board", () => {
			const square = getSquareFromCursorPosition(
				100,
				100,
				mockBoardNode,
				"a6",
				"b",
			);
			expect(square).toBe("g2");
		});

		it("should return 'a8' for cursor position near the bottom-right quadrant of the board", () => {
			const square = getSquareFromCursorPosition(
				700,
				700,
				mockBoardNode,
				"a6",
				"b",
			);
			expect(square).toBe("a8");
		});

		it("should return 'f1' for cursor position near the top-center of the board", () => {
			const square = getSquareFromCursorPosition(
				250,
				50,
				mockBoardNode,
				"a6",
				"b",
			);
			expect(square).toBe("f1");
		});

		it("should return 'c8' for cursor position near the bottom-center of the board", () => {
			const square = getSquareFromCursorPosition(
				550,
				750,
				mockBoardNode,
				"a6",
				"b",
			);
			expect(square).toBe("c8");
		});

		it("should return the initial square 'a6' for cursor position outside the board boundaries", () => {
			const square = getSquareFromCursorPosition(
				-1,
				-3,
				mockBoardNode,
				"a6",
				"b",
			);
			expect(square).toBe("a6");
		});

		it("should return the initial square 'a6' for cursor position far outside the board boundaries", () => {
			const square = getSquareFromCursorPosition(
				900,
				900,
				mockBoardNode,
				"a6",
				"b",
			);
			expect(square).toBe("a6");
		});
	});
});
