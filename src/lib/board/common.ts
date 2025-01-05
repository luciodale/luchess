import type {
	TBoard,
	TColor,
	TPiece,
	TRank,
	TSpecialMoveCastling,
	TSpecialMoveEnPassant,
	TSpecialMovePromotion,
	TSquare,
	TValidationResult,
} from "../constants";

function validateSameColorCapture(
	from: TPiece,
	to: TPiece | null,
	isWhite: boolean,
): TValidationResult {
	if (to && from[0] === to[0]) {
		return {
			valid: false,
			message: `${isWhite ? "White" : "Black"} piece can't capture another ${isWhite ? "white" : "black"} piece`,
		};
	}
	return { valid: true };
}

function validateTurnColor(
	piece: TPiece,
	currentColor: TColor,
): TValidationResult {
	const pieceColor = piece[0] === "w" ? "w" : "b";
	if (pieceColor !== currentColor) {
		return {
			valid: false,
			message: `It's ${currentColor === "w" ? "white" : "black"}'s turn. You can't move a ${pieceColor === "w" ? "white" : "black"} piece.`,
		};
	}
	return { valid: true };
}

export function sharedValidation(
	piece: TPiece,
	toPiece: TPiece | null,
	currentColor: TColor,
) {
	const turnValidation = validateTurnColor(piece, currentColor);

	if (!turnValidation.valid) {
		return turnValidation;
	}

	const sameColorCaptureValidation = validateSameColorCapture(
		piece,
		toPiece,
		currentColor === "w",
	);

	if (!sameColorCaptureValidation.valid) {
		return sameColorCaptureValidation;
	}

	return { valid: true };
}

export function isPawnPromotion(piece: TPiece, to: TSquare): boolean {
	const destinationRank = Number(to[1]) as TRank;
	return (
		(piece === "wp" && destinationRank === 8) ||
		(piece === "bp" && destinationRank === 1)
	);
}

export function handleSpecialMove(
	board: TBoard,
	specialMove:
		| TSpecialMoveEnPassant
		| TSpecialMoveCastling
		| TSpecialMovePromotion,
): void {
	if (specialMove.type === "enPassant") {
		board[specialMove.destinationPieceSquare] = null;
	} else if (specialMove.type === "castling") {
		const rookPiece = board[specialMove.rookFromSquare];
		if (rookPiece === "wr" || rookPiece === "br") {
			board[specialMove.rookFromSquare] = null;
			board[specialMove.rookToSquare] = rookPiece;
		}
	}
}
