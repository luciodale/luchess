import type {
	TBoard,
	THistory,
	TPiece,
	TSquare,
	TValidationResult,
} from "../constants";
import { validateBishopPosition } from "./bishop";
import { validateKnightPosition } from "./knight";
import { validatePawnPosition } from "./pawn";
import { validateRookPosition } from "./rook";

export function pieceValidation({
	piece,
	toPiece,
	fromSquare,
	toSquare,
	history,
	board,
}: {
	piece: TPiece;
	toPiece: TPiece | null;
	fromSquare: TSquare;
	toSquare: TSquare;
	history: THistory;
	board: TBoard;
}): TValidationResult {
	switch (piece) {
		case "bp":
		case "wp":
			return validatePawnPosition(
				piece,
				fromSquare,
				toPiece,
				toSquare,
				history,
			);

		case "bn":
		case "wn":
			return validateKnightPosition(fromSquare, toSquare);
		case "bb":
		case "wb":
			return validateBishopPosition(fromSquare, toSquare, board);
		case "br":
		case "wr":
			return validateRookPosition(fromSquare, toSquare, board);
		default:
			return { valid: false, message: "Unknown piece type" };
	}
}
