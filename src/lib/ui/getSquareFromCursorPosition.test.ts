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

	it("should return a8 for cursor position at top-left corner", () => {
		const square = getSquareFromCursorPosition(0, 0, mockBoardNode, "a6");
		expect(square).toBe("a8");
	});

	it("should return h8 for cursor position at top-right corner", () => {
		const square = getSquareFromCursorPosition(799, 0, mockBoardNode, "a6");
		expect(square).toBe("h8");
	});

	it("should return a1 for cursor position at bottom-left corner", () => {
		const square = getSquareFromCursorPosition(0, 799, mockBoardNode, "a6");
		expect(square).toBe("a1");
	});

	it("should return h1 for cursor position at bottom-right corner", () => {
		const square = getSquareFromCursorPosition(799, 799, mockBoardNode, "a6");
		expect(square).toBe("h1");
	});

	it("should return d4 for cursor position at center of the board", () => {
		const square = getSquareFromCursorPosition(400, 400, mockBoardNode, "a6");
		expect(square).toBe("e4");
	});

	it("should return e5 for cursor position slightly off-center", () => {
		const square = getSquareFromCursorPosition(450, 350, mockBoardNode, "a6");
		expect(square).toBe("e5");
	});

	it("should return b7 for cursor position near top-left", () => {
		const square = getSquareFromCursorPosition(100, 100, mockBoardNode, "a6");
		expect(square).toBe("b7");
	});

	it("should return g2 for cursor position near bottom-right", () => {
		const square = getSquareFromCursorPosition(700, 700, mockBoardNode, "a6");
		expect(square).toBe("h1");
	});

	it("should return c6 for cursor position near top-center", () => {
		const square = getSquareFromCursorPosition(250, 50, mockBoardNode, "a6");
		expect(square).toBe("c8");
	});

	it("should return f3 for cursor position near bottom-center", () => {
		const square = getSquareFromCursorPosition(550, 750, mockBoardNode, "a6");
		expect(square).toBe("f1");
	});

	it("should return the initial square for invalid cursor position", () => {
		const square = getSquareFromCursorPosition(-1, -3, mockBoardNode, "a6");
		expect(square).toBe("a6");
	});

	it("should return the initial square for cursor position outside the board", () => {
		const square = getSquareFromCursorPosition(900, 900, mockBoardNode, "a6");
		expect(square).toBe("a6");
	});
});
