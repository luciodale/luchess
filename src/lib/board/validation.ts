import type {
	TBoard,
	THistory,
	TPiece,
	TSquare,
	TValidationResult,
} from "../constants";
import { validateBishopPosition } from "./bishop";
import { validateKingPosition } from "./king";
import { validateKnightPosition } from "./knight";
import { validatePawnPosition } from "./pawn";
import { validateQueenPosition } from "./queen";
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
		case "bq":
		case "wq":
			return validateQueenPosition(fromSquare, toSquare, board);
		case "bk":
		case "wk":
			return validateKingPosition({
				piece,
				board,
				fromSquare,
				toSquare,
				history,
			});
		default:
			return { valid: false, message: "Unknown piece type" };
	}
}
