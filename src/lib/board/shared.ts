import type { ChessBoard } from "../Chess";
import type {
	TBoard,
	TColor,
	THistory,
	TPiece,
	TRank,
	TSpecialMoveCastling,
	TSpecialMoveEnPassant,
	TSpecialMovePromotion,
	TSquare,
	TValidationResult,
} from "../constants";
import { initialPositions } from "../constants";
import { debug } from "../debug/debug";
import { objectEntries } from "../utils";
import { isSquareUnderAttack } from "./isSquareUnderAttack";
import { pieceValidation } from "./validation";

function generateBoardSquares(): TSquare[] {
	const squares: TSquare[] = [];
	for (
		let fileChar = "a".charCodeAt(0);
		fileChar <= "h".charCodeAt(0);
		fileChar++
	) {
		for (let rank = 1; rank <= 8; rank++) {
			squares.push((String.fromCharCode(fileChar) + rank) as TSquare);
		}
	}
	return squares;
}

export function generateSinglePieceMoves(
	board: TBoard,
	fromSquare: TSquare,
	piece: TPiece,
	history: THistory,
) {
	const validMoves: { piece: TPiece; from: TSquare; to: TSquare }[] = [];
	const squares = generateBoardSquares();

	for (const toSquare of squares) {
		if (toSquare === fromSquare) continue;

		const res = validateTurnAndSameColorCapture({
			piece,
			toPiece: board[toSquare],
			currentColor: piece[0] === "w" ? "w" : "b",
		});
		if (!res.valid) {
			continue;
		}

		const { valid } = pieceValidation({
			piece,
			toPiece: board[toSquare],
			fromSquare,
			toSquare,
			history,
			board,
			currentColor: piece[0] === "w" ? "w" : "b",
		});

		if (valid) {
			validMoves.push({ piece, from: fromSquare, to: toSquare });
		}
	}

	return validMoves;
}

export function isCheckmate(
	board: TBoard,
	color: TColor,
	history: THistory,
): boolean {
	// Find king position
	const kingSquare = findKingPosition(board, color);
	if (!kingSquare) return false;

	// Verify king is in check
	const kingInCheck = isSquareUnderAttack({
		currentColor: color,
		board,
		toSquare: kingSquare,
		history,
	});
	if (!kingInCheck) return false;

	// Check each piece of current color
	for (const [fromSquare, piece] of objectEntries(board)) {
		if (!piece || piece[0] !== color) continue;

		// Get all valid moves for this piece
		const validMoves = generateSinglePieceMoves(
			board,
			fromSquare,
			piece,
			history,
		);

		// Try each move to see if it escapes check
		for (const toSquare of validMoves) {
			// Simulate move
			const simulatedBoard = {
				...board,
				[fromSquare]: null,
				[toSquare.to]: piece,
			};

			// Check if king is still in check after move
			const kingPosition = piece.endsWith("k") ? toSquare.to : kingSquare;
			const stillInCheck = isSquareUnderAttack({
				currentColor: color,
				board: simulatedBoard,
				toSquare: kingPosition,
				history,
			});

			if (!stillInCheck) {
				return false; // Found escape move
			}
		}
	}

	return true; // No escape found - checkmate
}

export function isStalemate(
	board: TBoard,
	color: TColor,
	history: THistory,
): boolean {
	debug("stalemate", `Checking stalemate for ${color}`);

	// 1. Find king position
	const kingSquare = findKingPosition(board, color);
	if (!kingSquare) {
		debug("stalemate", "King not found");
		return false;
	}

	// 2. Check king is NOT in check
	const kingInCheck = isSquareUnderAttack({
		currentColor: color,
		board,
		toSquare: kingSquare,
		history,
	});
	if (kingInCheck) {
		debug("stalemate", "King is in check");
		return false;
	}

	// 3. Check for ANY legal moves
	for (const [fromSquare, piece] of objectEntries(board)) {
		if (!piece || piece[0] !== color) continue;

		const moves = generateSinglePieceMoves(board, fromSquare, piece, history);

		if (moves.length > 0) return false;
	}

	return true; // No legal moves found
}

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

function findKingPosition(board: TBoard, color: TColor): TSquare | null {
	const kingPiece = `${color}k` as TPiece;
	for (const [square, piece] of objectEntries(board)) {
		if (piece === kingPiece) {
			return square;
		}
	}
	return null;
}

function simulateMove(
	board: TBoard,
	fromSquare: TSquare,
	toSquare: TSquare,
	piece: TPiece,
): TBoard {
	const newBoard = { ...board };
	newBoard[fromSquare] = null;
	newBoard[toSquare] = piece;
	return newBoard;
}

export function validateKingCheck(
	piece: TPiece,
	fromSquare: TSquare,
	toSquare: TSquare,
	board: TBoard,
	currentColor: TColor,
	history: THistory,
): TValidationResult {
	// Basic king move validation first
	const isKingMoving = piece.endsWith("k");
	const kingSquare = isKingMoving
		? toSquare
		: findKingPosition(board, currentColor);

	if (!kingSquare) {
		return { valid: false, message: "King not found" };
	}

	// Create board after move
	const simulatedBoard = {
		...board,
		[fromSquare]: null,
		[toSquare]: piece,
	};

	// Check if destination square is under attack
	const squareUnderAttack = isSquareUnderAttack({
		currentColor,
		board: simulatedBoard,
		toSquare: kingSquare,
		history,
	});

	return squareUnderAttack
		? {
				valid: false,
				message: "Move would leave king in check",
			}
		: {
				valid: true,
			};
}

export function validateTurnAndSameColorCapture({
	piece,
	toPiece,
	currentColor,
}: {
	piece: TPiece;
	toPiece: TPiece | null;
	currentColor: TColor;
}): TValidationResult {
	// 1) Validate turn color
	const turnValidation = validateTurnColor(piece, currentColor);
	if (!turnValidation.valid) {
		return turnValidation;
	}

	// 2) Validate same-color capture
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

export function validateKingCheckAndPromotion({
	piece,
	fromSquare,
	toSquare,
	board,
	currentColor,
	history,
}: {
	piece: TPiece;
	fromSquare: TSquare;
	toSquare: TSquare;
	board: TBoard;
	currentColor: TColor;
	history: THistory;
}): TValidationResult {
	// 3) Validate king check logic:
	//    - If the king is in check, only a king move that removes check is valid
	//    - Cannot move king into check
	const checkValidation = validateKingCheck(
		piece,
		fromSquare,
		toSquare,
		board,
		currentColor,
		history,
	);
	if (!checkValidation.valid) {
		return checkValidation;
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

export function setAllPiecesToNull(boardObject: ChessBoard) {
	const emptyBoard = {} as TBoard;
	for (const [square] of objectEntries(initialPositions)) {
		emptyBoard[square] = null;
	}

	boardObject.setFreeMode(emptyBoard);
}
