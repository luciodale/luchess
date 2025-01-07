import type { TSquare, TValidationResult } from "../constants";
import { debug } from "../debug/debug";

function validateKnightMove(
	fromSquare: TSquare,
	toSquare: TSquare,
): TValidationResult {
	debug("moves", `Validating knight move from ${fromSquare} to ${toSquare}`);

	const fileDiff = Math.abs(fromSquare.charCodeAt(0) - toSquare.charCodeAt(0));
	const rankDiff = Math.abs(
		Number.parseInt(fromSquare[1]) - Number.parseInt(toSquare[1]),
	);

	debug("moves", "Move metrics:", { fileDiff, rankDiff });

	const isValidMove =
		(fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2);

	if (!isValidMove) {
		debug("moves", "Invalid: Not an L-shape move");
		return {
			valid: false,
			message: "Knight can only move in an L-shape",
		};
	}

	debug("moves", "Valid knight move");
	return { valid: true };
}

export function validateKnightPosition(
	fromSquare: TSquare,
	toSquare: TSquare,
): TValidationResult {
	debug(
		"moves",
		`Validating knight position from ${fromSquare} to ${toSquare}`,
	);
	return validateKnightMove(fromSquare, toSquare);
}
