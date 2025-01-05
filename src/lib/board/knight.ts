import type { TSquare, TValidationResult } from "../constants";

function validateKnightMove(
	fromSquare: TSquare,
	toSquare: TSquare,
): TValidationResult {
	const fileDiff = Math.abs(fromSquare.charCodeAt(0) - toSquare.charCodeAt(0));
	const rankDiff = Math.abs(
		Number.parseInt(fromSquare[1]) - Number.parseInt(toSquare[1]),
	);

	const isValidMove =
		(fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2);

	if (!isValidMove) {
		return {
			valid: false,
			message: "Invalid knight move",
		};
	}

	return { valid: true };
}

export function validateKnightPosition(
	fromSquare: TSquare,
	toSquare: TSquare,
): TValidationResult {
	return validateKnightMove(fromSquare, toSquare);
}
