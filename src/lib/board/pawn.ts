import type {
	THistory,
	TPawn,
	TPiece,
	TSquare,
	TValidationResult,
} from "../constants";
import { debug } from "../debug/debug";

function validateMove(
	from: TSquare,
	toSquare: TSquare,
	isWhite: boolean,
): TValidationResult {
	debug(
		"moves",
		`Validating ${isWhite ? "white" : "black"} pawn move from ${from} to ${toSquare}`,
	);

	const originRank = Number(from[1]);
	const destinationRank = Number(toSquare[1]);
	const rankDiff = destinationRank - originRank;
	const fileDiff = Math.abs(toSquare.charCodeAt(0) - from.charCodeAt(0));

	debug("moves", "Move metrics:", {
		rankDiff,
		fileDiff,
		originRank,
		destinationRank,
	});

	if (fileDiff !== 0) {
		debug("moves", "Invalid: Pawn moving sideways without capture");
		return { valid: false, message: "Pawns can only move forward" };
	}

	if (isWhite) {
		if (rankDiff !== 1 && (originRank !== 2 || rankDiff !== 2)) {
			debug("moves", "Invalid: White pawn invalid move distance");
			return { valid: false, message: "Invalid pawn move" };
		}
	} else {
		if (rankDiff !== -1 && (originRank !== 7 || rankDiff !== -2)) {
			debug("moves", "Invalid: Black pawn invalid move distance");
			return { valid: false, message: "Invalid pawn move" };
		}
	}

	debug("moves", "Valid pawn move");
	return { valid: true };
}

function validateCapture(
	from: TSquare,
	toPiece: TPiece | null,
	toSquare: TSquare,
	isWhite: boolean,
	history: THistory,
): TValidationResult {
	debug(
		"moves",
		`Validating ${isWhite ? "white" : "black"} pawn capture from ${from} to ${toSquare}`,
	);
	debug("moves", "Target piece:", toPiece);

	const fileDiff = Math.abs(toSquare.charCodeAt(0) - from.charCodeAt(0));
	const rankDiff = Number(toSquare[1]) - Number(from[1]);
	debug("moves", "Capture metrics:", { fileDiff, rankDiff });

	if (fileDiff !== 1) {
		debug("moves", "Invalid: Capture must be diagonal");
		return { valid: false, message: "Invalid capture movement" };
	}

	const correctDirection = isWhite ? rankDiff === 1 : rankDiff === -1;
	if (!correctDirection) {
		debug("moves", "Invalid: Wrong capture direction");
		return { valid: false, message: "Wrong direction for capture" };
	}

	if (toPiece) {
		debug("moves", "Valid: Regular capture");
		return { valid: true };
	}

	debug("moves", "No piece to capture, checking en passant");
	const lastMove = history[history.length - 1];
	if (!lastMove) {
		debug("moves", "Invalid: No previous move for en passant");
		return { valid: false, message: "No piece to capture" };
	}

	debug("moves", "Last move:", lastMove);
	const isPawnDoubleStep =
		lastMove.piece.endsWith("p") &&
		Math.abs(Number(lastMove.to[1]) - Number(lastMove.from[1])) === 2;
	const isAdjacentFile =
		Math.abs(lastMove.to.charCodeAt(0) - from.charCodeAt(0)) === 1;
	const isSameRank = lastMove.to[1] === from[1];

	debug("moves", "En passant conditions:", {
		isPawnDoubleStep,
		isAdjacentFile,
		isSameRank,
	});

	if (isPawnDoubleStep && isAdjacentFile && isSameRank) {
		debug("moves", "Valid: En passant capture");
		return {
			valid: true,
			specialMove: {
				type: "enPassant",
				destinationPieceSquare: lastMove.to,
			},
		};
	}

	debug("moves", "Invalid: No valid capture available");
	return { valid: false, message: "No piece to capture" };
}

export function validatePawnPosition(
	piece: TPawn,
	fromSquare: TSquare,
	toPiece: TPiece | null,
	toSquare: TSquare,
	history: THistory,
): TValidationResult {
	const isWhite = piece[0] === "w";

	if (toPiece || toSquare[0] !== fromSquare[0]) {
		return validateCapture(fromSquare, toPiece, toSquare, isWhite, history);
	}

	return validateMove(fromSquare, toSquare, isWhite);
}
