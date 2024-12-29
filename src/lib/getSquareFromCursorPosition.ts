export function getSquareFromCursorPosition(
	e: MouseEvent,
	boardNode: HTMLElement,
) {
	const boardRect = boardNode.getBoundingClientRect();

	// Get the mouse position relative to the board
	const cursorX = e.clientX - boardRect.left;
	const cursorY = e.clientY - boardRect.top;

	// Get the board's dimensions
	const boardWidth = boardRect.width;
	const boardHeight = boardRect.height;

	// Convert the mouse position to percentages
	const xPercent = (cursorX / boardWidth) * 100;
	const yPercent = (cursorY / boardHeight) * 100;

	// Calculate the column (x axis) and row (y axis) based on percentages
	const col = Math.floor(xPercent / 12.5); // Each column is 12.5% of the board
	const row = 7 - Math.floor(yPercent / 12.5); // Each row is 12.5% of the board (flip y axis)

	// Get the square number, square-11 through square-88 (8x8 grid)
	const squareNumber = 8 * row + col + 1; // Convert row/col to square number (1-64)

	// Format square like square-11, square-22, ..., square-88
	const squareId = `square-${String(squareNumber).padStart(2, "0")}`;
	console.log("squareId", squareId);

	return squareId; // Example: "square-11", "square-55", etc.
}
