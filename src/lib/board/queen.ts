import type { TBoard, TSquare, TValidationResult } from "../constants";
import { debug } from "../debug/debug";
import { validateBishopPosition } from "./bishop";
import { validateRookPosition } from "./rook";

function validateQueenMove(
	fromSquare: TSquare,
	toSquare: TSquare,
	board: TBoard,
): TValidationResult {
	debug("moves", `Validating queen move from ${fromSquare} to ${toSquare}`);

	const fileDiff = Math.abs(fromSquare.charCodeAt(0) - toSquare.charCodeAt(0));
	const rankDiff = Math.abs(
		Number.parseInt(fromSquare[1]) - Number.parseInt(toSquare[1]),
	);

	debug("moves", "Move metrics:", { fileDiff, rankDiff });

	const isDiagonalMove = fileDiff === rankDiff;
	const isStraightMove = fileDiff === 0 || rankDiff === 0;
	debug("moves", "Move type:", { isDiagonalMove, isStraightMove });

	if (isDiagonalMove) {
		debug("moves", "Validating as bishop move");
		return validateBishopPosition(fromSquare, toSquare, board);
	}
	if (isStraightMove) {
		debug("moves", "Validating as rook move");
		return validateRookPosition(fromSquare, toSquare, board);
	}

	debug("moves", "Invalid: Neither diagonal nor straight move");
	return {
		valid: false,
		message: "Invalid queen move",
	};
}

export function validateQueenPosition(
	fromSquare: TSquare,
	toSquare: TSquare,
	board: TBoard,
): TValidationResult {
	debug("moves", `Validating queen position from ${fromSquare} to ${toSquare}`);
	return validateQueenMove(fromSquare, toSquare, board);
}
