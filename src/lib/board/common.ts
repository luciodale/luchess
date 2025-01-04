import type {
	TBoard,
	TPiece,
	TRank,
	TSpecialMoveCastling,
	TSpecialMoveEnPassant,
	TSpecialMovePromotion,
	TSquare,
	TValidationResult,
} from "../constants";

export function validateSameColorCapture(
	originPiece: TPiece,
	destinationPiece: TPiece | null,
	isWhite: boolean,
): TValidationResult {
	if (destinationPiece && originPiece[0] === destinationPiece[0]) {
		return {
			valid: false,
			message: `${isWhite ? "White" : "Black"} piece can't capture another ${isWhite ? "white" : "black"} piece`,
		};
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
