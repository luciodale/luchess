import type { TBoard, TSquare, TValidationResult } from "../constants";

function validateBishopMove(
	fromSquare: TSquare,
	toSquare: TSquare,
	board: TBoard,
): TValidationResult {
	const fromFile = fromSquare.charCodeAt(0);
	const toFile = toSquare.charCodeAt(0);
	const fromRank = Number.parseInt(fromSquare[1]);
	const toRank = Number.parseInt(toSquare[1]);

	const fileDiff = Math.abs(fromFile - toFile);
	const rankDiff = Math.abs(fromRank - toRank);

	if (fileDiff !== rankDiff) {
		return { valid: false, message: "Bishop can only move diagonally" };
	}

	const fileDirection = Math.sign(toFile - fromFile);
	const rankDirection = Math.sign(toRank - fromRank);

	const pathLength = fileDiff;
	const files = Array.from(
		{ length: pathLength },
		(_, i) => fromFile + fileDirection * (i + 1),
	);
	const ranks = Array.from(
		{ length: pathLength },
		(_, i) => fromRank + rankDirection * (i + 1),
	);

	for (let i = 0; i < pathLength - 1; i++) {
		const square = `${String.fromCharCode(files[i])}${ranks[i]}` as TSquare;
		if (board[square]) {
			return { valid: false, message: "Bishop cannot jump over pieces" };
		}
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
