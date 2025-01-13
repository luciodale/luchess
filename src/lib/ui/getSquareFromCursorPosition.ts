import { type TColor, type TSquare, files, ranks } from "../constants";

export function getSquareFromCursorPosition(
	clientX: number,
	clientY: number,
	boardNode: HTMLElement,
	initSquare: TSquare | null,
	orientation: TColor,
) {
	const { top, left, width, height } = boardNode.getBoundingClientRect();

	// Get the mouse position relative to the board
	const cursorX = clientX - left;
	const cursorY = clientY - top;

	// Get the board's dimensions
	const boardWidth = width;
	const boardHeight = height;

	// Convert the mouse position to percentages
	const xPercent = (cursorX / boardWidth) * 100;
	const yPercent = (cursorY / boardHeight) * 100;

	// Calculate the column and row based on the player's color
	let col: number;
	let row: number;

	if (orientation === "w") {
		// Standard orientation (white at bottom)
		col = Math.floor(xPercent / 12.5); // Each column is 12.5% of the board
		row = 7 - Math.floor(yPercent / 12.5); // Flip y axis for rows
	} else {
		// Flipped orientation (black at bottom)
		col = 7 - Math.floor(xPercent / 12.5); // Reverse columns
		row = Math.floor(yPercent / 12.5); // Reverse rows
	}

	const file = files[col];
	const rank = ranks[row];

	if (!file || !rank) return initSquare;

	// Format square like a1, b2, ..., h8
	return `${file}${rank}` as const;
}
