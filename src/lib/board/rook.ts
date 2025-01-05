import type { TBoard, TSquare, TValidationResult } from "../constants";

function validateRookMove(
	fromSquare: TSquare,
	toSquare: TSquare,
	board: TBoard,
): TValidationResult {
	const fileDiff = Math.abs(fromSquare.charCodeAt(0) - toSquare.charCodeAt(0));
	const rankDiff = Math.abs(
		Number.parseInt(fromSquare[1]) - Number.parseInt(toSquare[1]),
	);

	const isValidMove = fileDiff === 0 || rankDiff === 0;

	if (!isValidMove) {
		return {
			valid: false,
			message: "Invalid rook move",
		};
	}

	// Check if there are any pieces between the starting square and the ending square
	const fileDirection =
		fileDiff === 0
			? 0
			: fromSquare.charCodeAt(0) < toSquare.charCodeAt(0)
				? 1
				: -1;
	const rankDirection =
		rankDiff === 0
			? 0
			: Number.parseInt(fromSquare[1]) < Number.parseInt(toSquare[1])
				? 1
				: -1;

	let currentFile = fromSquare.charCodeAt(0) + fileDirection;
	let currentRank = Number.parseInt(fromSquare[1]) + rankDirection;

	while (
		currentFile !== toSquare.charCodeAt(0) ||
		currentRank !== Number.parseInt(toSquare[1])
	) {
		const currentSquare = String.fromCharCode(currentFile) + currentRank;
		if (board[currentSquare as TSquare]) {
			return {
				valid: false,
				message: "Rook cannot jump over pieces",
			};
		}
		currentFile += fileDirection;
		currentRank += rankDirection;
	}

	return { valid: true };
}

export function validateRookPosition(
	fromSquare: TSquare,
	toSquare: TSquare,
	board: TBoard,
): TValidationResult {
	return validateRookMove(fromSquare, toSquare, board);
}
