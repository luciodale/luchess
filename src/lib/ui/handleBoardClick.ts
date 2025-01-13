import type { ChessBoard } from "../Chess";
import type { TColor, TDragState } from "../constants";
import { getSquareFromCursorPosition } from "./getSquareFromCursorPosition";
import { showHints } from "./handleHints";
import { getEventPosition } from "./utils";

export function handleBoardMouseUp({
	e,
	boardNode,
	orientation,
	chessBoard,
	dragState,
}: {
	e: MouseEvent | TouchEvent;
	boardNode: HTMLElement;
	orientation: TColor;
	chessBoard: ChessBoard;
	dragState: TDragState;
}) {
	const { clientX, clientY } = getEventPosition(e);

	const clickedSquare = getSquareFromCursorPosition(
		clientX,
		clientY,
		boardNode,
		null,
		orientation,
	);

	// if clicking on the same piece, reset dragState
	if (
		clickedSquare &&
		dragState.piece &&
		dragState.square === clickedSquare &&
		dragState.piece === chessBoard.board[clickedSquare] &&
		dragState.secondSelect
	) {
		dragState.piece = null;
		dragState.square = null;
		dragState.secondSelect = false;
		dragState.validMoves = [];
	}
}

export function handleBoardMouseDown({
	e,
	boardNode,
	orientation,
	chessBoard,
	dragState,
}: {
	e: MouseEvent | TouchEvent;
	boardNode: HTMLElement;
	orientation: TColor;
	chessBoard: ChessBoard;
	dragState: TDragState;
}) {
	const { clientX, clientY } = getEventPosition(e);

	const clickedSquare = getSquareFromCursorPosition(
		clientX,
		clientY,
		boardNode,
		null,
		orientation,
	);

	const clickedPiece = clickedSquare && chessBoard.board[clickedSquare];
	const sameColorClicked =
		clickedPiece && clickedPiece[0] === chessBoard.currentColor;
	const samePieceClicked =
		clickedPiece &&
		clickedPiece === dragState.piece &&
		clickedSquare &&
		dragState.square === clickedSquare;

	if (samePieceClicked) {
		dragState.secondSelect = true;
		return;
	}

	if (clickedPiece) {
		showHints({
			board: chessBoard.board,
			piece: clickedPiece,
			fromSquare: clickedSquare,
			dragState,
			currentColor: chessBoard.currentColor,
			history: chessBoard.history,
		});
	}

	// NOT A FIRST CLICK. HANDLE MOVES
	if (dragState.piece) {
		const validMove = dragState.validMoves.find(
			(move) => move.square === clickedSquare,
		);

		// MOVE PIECE
		if (validMove) {
			if (dragState.square && clickedSquare)
				chessBoard.setPiece(dragState.square, clickedSquare, dragState.piece);

			dragState.piece = null;
			dragState.square = null;
			dragState.secondSelect = false;
			dragState.validMoves = [];

			return;
		}

		// if clicking on a null square, reset dragState
		if (!clickedPiece) {
			dragState.piece = null;
			dragState.square = null;
			dragState.secondSelect = false;
			dragState.validMoves = [];
			return;
		}

		// if clicking on a piece of the opposite color, set new dragState for highlighting
		// but don't show hints
		if (!sameColorClicked) {
			dragState.piece = clickedPiece;
			dragState.square = clickedSquare;
			dragState.validMoves = [];
			return;
		}
	}

	dragState.piece = clickedPiece;
	dragState.square = clickedSquare;
	dragState.secondSelect = false;
}
