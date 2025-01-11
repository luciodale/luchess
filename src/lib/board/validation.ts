import type {
	TBoard,
	TColor,
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
import { validateKingCheckAndPromotion } from "./shared";

export function pieceValidation({
	piece,
	toPiece,
	fromSquare,
	toSquare,
	history,
	board,
	currentColor,
}: {
	piece: TPiece;
	toPiece: TPiece | null;
	fromSquare: TSquare;
	toSquare: TSquare;
	history: THistory;
	board: TBoard;
	currentColor: TColor;
}): TValidationResult {
	const sharedValidationRes = validateKingCheckAndPromotion({
		piece,
		fromSquare,
		toSquare,
		board,
		currentColor,
		history,
	});

	if (!sharedValidationRes.valid) {
		return sharedValidationRes;
	}

	switch (piece) {
		case "bp":
		case "wp":
			return validatePawnPosition(
				piece,
				fromSquare,
				toPiece,
				toSquare,
				history,
				board,
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
