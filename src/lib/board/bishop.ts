import type { TBoard, TSquare, TValidationResult } from "../constants";

function validateBishopMove(
	fromSquare: TSquare,
	toSquare: TSquare,
	board: TBoard,
): TValidationResult {
	const fileDiff = Math.abs(fromSquare.charCodeAt(0) - toSquare.charCodeAt(0));
	const rankDiff = Math.abs(
		Number.parseInt(fromSquare[1]) - Number.parseInt(toSquare[1]),
	);

	const isValidMove = fileDiff === rankDiff;

	if (!isValidMove) {
		return {
			valid: false,
			message: "Bishop can only move diagonally",
		};
	}

	// Check if there are any pieces between the starting square and the ending square
	const fileDirection =
		fromSquare.charCodeAt(0) < toSquare.charCodeAt(0) ? 1 : -1;
	const rankDirection =
		Number.parseInt(fromSquare[1]) < Number.parseInt(toSquare[1]) ? 1 : -1;

	let currentFile = fromSquare.charCodeAt(0) + fileDirection;
	let currentRank = Number.parseInt(fromSquare[1]) + rankDirection;

	while (
		currentFile !== toSquare.charCodeAt(0) &&
		currentRank !== Number.parseInt(toSquare[1])
	) {
		const currentSquare = String.fromCharCode(currentFile) + currentRank;
		if (board[currentSquare as TSquare]) {
			return {
				valid: false,
				message: "Bishop cannot jump over pieces",
			};
		}
		currentFile += fileDirection;
		currentRank += rankDirection;
	}

	return { valid: true };
}

export function validateBishopPosition(
	fromSquare: TSquare,
	toSquare: TSquare,
	board: TBoard,
): TValidationResult {
	return validateBishopMove(fromSquare, toSquare, board);
}
