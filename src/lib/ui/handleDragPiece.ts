import type { ChessBoard } from "../Chess";
import type { TColor, TDragState, TPiece, TSquare } from "../constants";
import { debug } from "../debug/debug";
import { getSquareFromCursorPosition } from "./getSquareFromCursorPosition";
import { clearHints, showHints } from "./handleHints";
import { getEventPosition, isHTMLElement } from "./utils";

// listeners to track the piece being dragged around the board and released
// We need a stable reference to the listeners to be able to remove them
let movePieceListener: ((event: MouseEvent | TouchEvent) => void) | null;
let releasePieceListener: ((event: MouseEvent | TouchEvent) => void) | null;

function removeListeners(boardNode: HTMLElement) {
	if (!movePieceListener || !releasePieceListener)
		throw Error("Invalid arguments");

	boardNode.removeEventListener("mousemove", movePieceListener);
	boardNode.removeEventListener("mouseup", releasePieceListener);

	boardNode.removeEventListener("touchmove", movePieceListener);
	boardNode.removeEventListener("touchend", releasePieceListener);
}

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

function handleReleasePiece({
	e,
	draggedPieceNode,
	boardNode,
	chessBoard,
	piece,
	square,
	orientation,
	dragState,
}: {
	e: MouseEvent | TouchEvent;
	draggedPieceNode: HTMLElement;
	boardNode: HTMLElement;
	chessBoard: ChessBoard;
	piece: TPiece;
	square: TSquare;
	orientation: TColor;
	dragState: TDragState;
}) {
	const { clientX, clientY } = getEventPosition(e);

	const to = getSquareFromCursorPosition(
		clientX,
		clientY,
		boardNode,
		square,
		orientation,
	);

	debug("drag", `Moving ${piece} from ${square} to ${to}`);
	const res = chessBoard.setPiece(square, to, piece);

	if (res?.valid) clearHints(dragState);

	draggedPieceNode.classList.remove("dragging");
	draggedPieceNode.style.transform = "";

	removeListeners(boardNode);
}

export function handleDragPiece({
	e,
	chessBoard,
	piece,
	square,
	boardNode,
	orientation,
	dragState,
	currentColor,
}: {
	e: MouseEvent | TouchEvent;
	chessBoard: ChessBoard;
	piece: TPiece;
	square: TSquare;
	boardNode: HTMLElement;
	orientation: TColor;
	dragState: TDragState;
	currentColor: TColor;
}) {
	if (!isHTMLElement(e.target) || !isHTMLElement(boardNode)) return;

	if (e instanceof TouchEvent) {
		e.preventDefault();
	}

	showHints({
		piece,
		fromSquare: square,
		board: chessBoard.board,
		history: chessBoard.history,
		dragState,
		currentColor,
	});

	const draggedPieceNode = e.target;

	draggedPieceNode.classList.add("dragging");

	// Run the position logic immediately on mousedown
	handleMovePiece(e, draggedPieceNode, boardNode);

	movePieceListener = (e: MouseEvent | TouchEvent) =>
		handleMovePiece(e, draggedPieceNode, boardNode);
	releasePieceListener = (e: MouseEvent | TouchEvent) =>
		handleReleasePiece({
			e,
			draggedPieceNode,
			boardNode,
			chessBoard,
			piece,
			square,
			orientation,
			dragState,
		});

	boardNode.addEventListener("mousemove", movePieceListener);
	boardNode.addEventListener("mouseup", releasePieceListener);

	boardNode.addEventListener("touchmove", movePieceListener);
	boardNode.addEventListener("touchend", releasePieceListener);
}
