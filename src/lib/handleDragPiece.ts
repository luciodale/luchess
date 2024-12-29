import { getSquareFromCursorPosition } from "./getSquareFromCursorPosition";
import { isHTMLElement } from "./utils";

// listeners to track the piece being dragged around the board and released
// We need a stable reference to the listeners to be able to remove them
let movePieceListener: ((event: MouseEvent) => void) | null;
let releasePieceListener: ((event: MouseEvent) => void) | null;

function handleMovePiece(
	e: MouseEvent,
	draggedPiece: HTMLElement,
	board: HTMLElement,
) {
	if (!draggedPiece) return;

	getSquareFromCursorPosition(e, board);

	const boardRect = board?.getBoundingClientRect();

	if (!boardRect) return;

	// Cursor position relative to the board (in pixels)
	const cursorX = e.clientX - boardRect.left;
	const cursorY = e.clientY - boardRect.top;

	// Piece dimensions
	const pieceWidth = draggedPiece.offsetWidth;
	const pieceHeight = draggedPiece.offsetHeight;

	// Center the piece on the cursor
	const centeredX = cursorX - pieceWidth / 2;
	const centeredY = cursorY - pieceHeight / 2;

	// Apply the position (in pixels, relative to the board)
	draggedPiece.style.transform = `translate(${centeredX}px, ${centeredY}px)`;
}

function handleReleasePiece(
	e: MouseEvent,
	draggedPiece: HTMLElement,
	board: HTMLElement,
) {
	if (
		!draggedPiece ||
		!isHTMLElement(board) ||
		!movePieceListener ||
		!releasePieceListener
	)
		throw Error("Invalid arguments");

	draggedPiece.classList.remove("dragging");
	draggedPiece.style.transform = "";

	const cell = board?.querySelector(".highlight");

	if (cell?.contains(e.target as Node)) {
		console.log("in contains");

		if (cell) cell.classList.value = "element-pool";
	}

	board.removeEventListener("mousemove", movePieceListener);
	board.removeEventListener("mouseup", releasePieceListener);
}

export function handleDragPiece(e: MouseEvent) {
	const board = document.querySelector(".board");

	if (!isHTMLElement(e.target) || !isHTMLElement(board)) return;

	const draggedPiece = e.target;
	console.log("Start dragging");

	draggedPiece.classList.add("dragging");

	// Run the position logic immediately on mousedown
	handleMovePiece(e, draggedPiece, board);

	// Add event listeners for continuous updates
	const cell = board?.querySelector(".element-pool");

	const square = draggedPiece.getAttribute("data-square");
	console.log("square", square);
	cell?.classList.add("highlight", `square-${square}`);

	movePieceListener = (e: MouseEvent) =>
		handleMovePiece(e, draggedPiece, board);
	releasePieceListener = (e: MouseEvent) =>
		handleReleasePiece(e, draggedPiece, board);

	board.addEventListener("mousemove", movePieceListener);
	board.addEventListener("mouseup", releasePieceListener);
}
