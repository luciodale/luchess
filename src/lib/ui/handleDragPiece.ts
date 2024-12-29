import type { ChessBoard } from "../board/ChessBoard";
import type { TPiece, TSquare } from "../constants";
import { getSquareFromCursorPosition } from "./getSquareFromCursorPosition";
import { getEventPosition, isHTMLElement } from "./utils";

// listeners to track the piece being dragged around the board and released
// We need a stable reference to the listeners to be able to remove them
let movePieceListener: ((event: MouseEvent | TouchEvent) => void) | null;
let releasePieceListener: ((event: MouseEvent | TouchEvent) => void) | null;

function handleMovePiece(
	e: MouseEvent | TouchEvent,
	draggedPieceNode: HTMLElement,
	boardNode: HTMLElement,
) {
	const boardRect = boardNode.getBoundingClientRect();
	const { clientX, clientY } = getEventPosition(e);

	// Cursor position relative to the board (in pixels)
	const cursorX = clientX - boardRect.left;
	const cursorY = clientY - boardRect.top;

	// Piece dimensions
	const pieceWidth = draggedPieceNode.offsetWidth;
	const pieceHeight = draggedPieceNode.offsetHeight;

	// Center the piece on the cursor
	const centeredX = cursorX - pieceWidth / 2;
	const centeredY = cursorY - pieceHeight / 2;

	// Apply the position (in pixels, relative to the board)
	draggedPieceNode.style.transform = `translate(${centeredX}px, ${centeredY}px)`;
}

function handleReleasePiece(
	e: MouseEvent | TouchEvent,
	draggedPieceNode: HTMLElement,
	boardNode: HTMLElement,
	chessBoard: ChessBoard,
	piece: TPiece,
	square: TSquare,
) {
	if (!movePieceListener || !releasePieceListener)
		throw Error("Invalid arguments");

	const { clientX, clientY } = getEventPosition(e);

	const initalSquare = draggedPieceNode.getAttribute("data-square");
	const targetSquare = getSquareFromCursorPosition(clientX, clientY, boardNode);

	draggedPieceNode.classList.remove("dragging");
	draggedPieceNode.style.transform = "";

	const cell = boardNode?.querySelector(".highlight");

	if (cell?.contains(e.target as Node)) {
		console.log("in contains");

		if (cell) cell.classList.value = "element-pool";
	}

	boardNode.removeEventListener("mousemove", movePieceListener);
	boardNode.removeEventListener("mouseup", releasePieceListener);

	boardNode.removeEventListener("touchmove", movePieceListener);
	boardNode.removeEventListener("touchend", releasePieceListener);
}

export function handleDragPiece(
	e: MouseEvent | TouchEvent,
	chessBoard: ChessBoard,
	piece: TPiece,
	square: TSquare,
	boardNode: HTMLElement,
) {
	if (!isHTMLElement(e.target) || !isHTMLElement(boardNode)) return;

	if (e instanceof TouchEvent) {
		e.preventDefault();
	}

	const draggedPieceNode = e.target;
	console.log("Start dragging");

	draggedPieceNode.classList.add("dragging");

	// Run the position logic immediately on mousedown
	handleMovePiece(e, draggedPieceNode, boardNode);

	// Add event listeners for continuous updates
	const cell = boardNode?.querySelector(".element-pool");

	cell?.classList.add("highlight", `square-${square}`);

	movePieceListener = (e: MouseEvent | TouchEvent) =>
		handleMovePiece(e, draggedPieceNode, boardNode);
	releasePieceListener = (e: MouseEvent | TouchEvent) =>
		handleReleasePiece(
			e,
			draggedPieceNode,
			boardNode,
			chessBoard,
			piece,
			square,
		);

	boardNode.addEventListener("mousemove", movePieceListener);
	boardNode.addEventListener("mouseup", releasePieceListener);

	boardNode.addEventListener("touchmove", movePieceListener);
	boardNode.addEventListener("touchend", releasePieceListener);
}
