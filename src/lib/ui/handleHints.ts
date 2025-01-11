import { generateSinglePieceMoves } from "../board/shared";
import type {
	TBoard,
	TDragState,
	THistory,
	TPiece,
	TSquare,
} from "../constants";

export function showHints({
	piece,
	fromSquare,
	board,
	history,
	dragState,
}: {
	piece: TPiece;
	fromSquare: TSquare;
	board: TBoard;
	history: THistory;
	dragState: TDragState;
}) {
	const moves = generateSinglePieceMoves(board, fromSquare, piece, history);

	dragState.piece = piece;
	dragState.square = fromSquare;
	dragState.validMoves = moves.map((move) => ({
		square: move.to,
		isCapture: !!move.capture,
	}));
}

export function clearHints(dragState: TDragState) {
	dragState.piece = null;
	dragState.square = null;
	dragState.validMoves = [];
}
