import type {
	TBoard,
	TFile,
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

export function isPawnPromotion(piece: TPiece, targetSquare: TSquare): boolean {
	const destinationRank = Number(targetSquare[1]) as TRank;
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
		board[specialMove.capturedPieceSquare] = null;
	} else if (specialMove.type === "castling") {
		const rookPiece = board[specialMove.rookFromSquare];
		if (rookPiece === "wr" || rookPiece === "br") {
			board[specialMove.rookFromSquare] = null;
			board[specialMove.rookToSquare] = rookPiece;
		}
	}
	// Promotion is handled in setPiece method of ChessBoard
}

export function undoSpecialMove(
	board: TBoard,
	specialMove:
		| TSpecialMoveEnPassant
		| TSpecialMoveCastling
		| TSpecialMovePromotion,
): void {
	if (specialMove.type === "enPassant") {
		const capturedPawnColor =
			specialMove.capturedPieceSquare[1] === "3" ? "w" : "b";
		board[specialMove.capturedPieceSquare] = `${capturedPawnColor}p` as TPiece;
	} else if (specialMove.type === "castling") {
		const rookPiece = board[specialMove.rookToSquare];
		if (rookPiece === "wr" || rookPiece === "br") {
			board[specialMove.rookFromSquare] = rookPiece;
			board[specialMove.rookToSquare] = null;
		}
	}
	// Promotion doesn't need special handling for undo
}

export function isValidSquare(square: string): square is TSquare {
	if (square.length !== 2) return false;
	const file = square[0] as TFile;
	const rank = Number(square[1]) as TRank;
	return (
		["a", "b", "c", "d", "e", "f", "g", "h"].includes(file) &&
		rank >= 1 &&
		rank <= 8
	);
}

export function getSquareColor(square: TSquare): "light" | "dark" {
	const file = square.charCodeAt(0) - 97; // 'a' is 97 in ASCII
	const rank = Number(square[1]) - 1;
	return (file + rank) % 2 === 0 ? "light" : "dark";
}

export function getPieceColor(piece: TPiece): "white" | "black" {
	return piece[0] === "w" ? "white" : "black";
}

export function isOpponentPiece(
	piece: TPiece,
	opponentColor: "white" | "black",
): boolean {
	return getPieceColor(piece) === opponentColor;
}

export function getOpponentColor(color: "white" | "black"): "white" | "black" {
	return color === "white" ? "black" : "white";
}
