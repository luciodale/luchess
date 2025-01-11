import {
	MAX_MOVES_TO_CHECK,
	type TBoard,
	THREEFOLD_REPETITION_COUNT,
	type THistory,
	type TPiece,
	type TSquare,
} from "../constants";

export function hasInsufficientMaterial(board: TBoard): boolean {
	const pieces = Object.values(board).filter(Boolean);

	if (pieces.length === 2) return true;

	return false;
}

function simulateBasicMove(
	board: TBoard,
	fromSquare: TSquare,
	toSquare: TSquare,
	piece: TPiece,
): TBoard {
	const newBoard = { ...board };
	newBoard[fromSquare] = null;
	newBoard[toSquare] = piece;
	return newBoard;
}

export function isThreefoldRepetition(
	board: TBoard,
	history: THistory,
): boolean {
	const boardToString = (b: TBoard) => JSON.stringify(b);
	const positions: string[] = [];

	let currentBoard = { ...board };
	positions.push(boardToString(currentBoard));

	const relevantHistory = history.slice(
		Math.max(history.length - MAX_MOVES_TO_CHECK, 0),
	);

	for (let i = relevantHistory.length - 1; i >= 0; i--) {
		const move = relevantHistory[i];
		currentBoard = simulateBasicMove(
			currentBoard,
			move.to,
			move.from,
			move.piece,
		);
		positions.push(boardToString(currentBoard));
	}

	for (const position of positions) {
		if (
			positions.filter((p) => p === position).length >=
			THREEFOLD_REPETITION_COUNT
		) {
			return true;
		}
	}

	return false;
}

export function isFiftyMoveRule(history: THistory): boolean {
	// Check last 50 moves for pawn moves or captures
	const relevantHistory = history.slice(-100); // 50 moves = 100 half-moves
	return (
		relevantHistory.length >= 100 &&
		!relevantHistory.some(
			(move) =>
				move.piece.endsWith("p") || // Pawn move
				move.capture, // Capture
		)
	);
}

export function isDraw(board: TBoard, history: THistory): boolean {
	return (
		hasInsufficientMaterial(board) ||
		isThreefoldRepetition(board, history) ||
		isFiftyMoveRule(history)
	);
}
