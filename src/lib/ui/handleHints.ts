import { generateSinglePieceMoves } from "../board/shared";
import type {
	TBoard,
	TColor,
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
	currentColor,
}: {
	piece: TPiece;
	fromSquare: TSquare;
	board: TBoard;
	history: THistory;
	dragState: TDragState;
	currentColor: TColor;
}) {
	if (piece[0] !== currentColor) return;

	const moves = generateSinglePieceMoves(board, fromSquare, piece, history);

	dragState.validMoves = moves.map((move) => ({
		square: move.to,
		isCapture: !!move.capture,
	}));
}
