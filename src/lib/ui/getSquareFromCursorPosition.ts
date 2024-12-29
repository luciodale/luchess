import { type TSquare, files, ranks } from "../constants";

export function getSquareFromCursorPosition(
	clientX: number,
	clientY: number,
	boardNode: HTMLElement,
	initSquare: TSquare,
) {
	const { top, left, width, height } = boardNode.getBoundingClientRect();
	if (clientX < 0 || clientY < 0 || clientX > width || clientY > height)
		return initSquare;

	// Get the mouse position relative to the board
	const cursorX = clientX - left;
	const cursorY = clientY - top;

	// Get the board's dimensions
	const boardWidth = width;
	const boardHeight = height;

	// Convert the mouse position to percentages
	const xPercent = (cursorX / boardWidth) * 100;
	const yPercent = (cursorY / boardHeight) * 100;

	// Calculate the column (x axis) and row (y axis) based on percentages
	const col = Math.floor(xPercent / 12.5); // Each column is 12.5% of the board
	const row = 7 - Math.floor(yPercent / 12.5); // Each row is 12.5% of the board (flip y axis)

	const file = files[col];
	const rank = ranks[row];

	// Format square like a1, b2, ..., h8
	const squareId = `${file}${rank}`;

	return squareId; // Example: "a1", "b2", etc.
}
