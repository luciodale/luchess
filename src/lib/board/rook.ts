import type { TBoard, TSquare, TValidationResult } from "../constants";
import { debug } from "../debug/debug";

function validateRookMove(
	fromSquare: TSquare,
	toSquare: TSquare,
	board: TBoard,
): TValidationResult {
	debug("moves", `Validating rook move from ${fromSquare} to ${toSquare}`);

	const fileDiff = Math.abs(fromSquare.charCodeAt(0) - toSquare.charCodeAt(0));
	const rankDiff = Math.abs(
		Number.parseInt(fromSquare[1]) - Number.parseInt(toSquare[1]),
	);

	debug("moves", "Move metrics:", { fileDiff, rankDiff });

	const isValidMove = fileDiff === 0 || rankDiff === 0;

	if (!isValidMove) {
		debug("moves", "Invalid: Not a straight line move");
		return {
			valid: false,
			message: "Rook can only move horizontally or vertically",
		};
	}

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

	debug("moves", "Movement direction:", { fileDirection, rankDirection });

	let currentFile = fromSquare.charCodeAt(0) + fileDirection;
	let currentRank = Number.parseInt(fromSquare[1]) + rankDirection;

	debug("moves", "Checking path for pieces");
	while (
		currentFile !== toSquare.charCodeAt(0) ||
		currentRank !== Number.parseInt(toSquare[1])
	) {
		const currentSquare = String.fromCharCode(currentFile) + currentRank;
		debug("moves", `Checking square: ${currentSquare}`);

		if (board[currentSquare as TSquare]) {
			debug("moves", `Invalid: Piece found at ${currentSquare}`);
			return {
				valid: false,
				message: "Rook cannot jump over pieces",
			};
		}
		currentFile += fileDirection;
		currentRank += rankDirection;
	}

	debug("moves", "Valid rook move");
	return { valid: true };
}

export function validateRookPosition(
	fromSquare: TSquare,
	toSquare: TSquare,
	board: TBoard,
): TValidationResult {
	debug("moves", `Validating rook position from ${fromSquare} to ${toSquare}`);
	return validateRookMove(fromSquare, toSquare, board);
}
