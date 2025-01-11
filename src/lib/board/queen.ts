import type { TBoard, TSquare, TValidationResult } from "../constants";
import { debug } from "../debug/debug";

function validateQueenMove(
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

	// Queen must move either diagonally or straight
	const isValidMove = fileDiff === rankDiff || fileDiff === 0 || rankDiff === 0;
	if (!isValidMove) {
		return { valid: false, message: "Invalid queen move" };
	}

	const fileDirection = Math.sign(toFile - fromFile);
	const rankDirection = Math.sign(toRank - fromRank);

	// Generate arrays of file and rank positions
	const files = Array.from(
		{ length: Math.abs(toFile - fromFile) },
		(_, i) => fromFile + fileDirection * (i + 1),
	);
	const ranks = Array.from(
		{ length: Math.abs(toRank - fromRank) },
		(_, i) => fromRank + rankDirection * (i + 1),
	);

	// Check path squares
	const maxLength = Math.max(files.length, ranks.length);
	for (let i = 0; i < maxLength - 1; i++) {
		const file = files[i] || fromFile;
		const rank = ranks[i] || fromRank;
		const square = `${String.fromCharCode(file)}${rank}` as TSquare;

		if (board[square]) {
			debug("moves", `Queen path blocked at ${square}`);
			return { valid: false, message: "Path is blocked" };
		}
	}

	return { valid: true };
}

export function validateQueenPosition(
	fromSquare: TSquare,
	toSquare: TSquare,
	board: TBoard,
): TValidationResult {
	return validateQueenMove(fromSquare, toSquare, board);
}
