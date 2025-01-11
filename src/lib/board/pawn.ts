import type {
	TBoard,
	THistory,
	TPawn,
	TPiece,
	TSquare,
	TValidationResult,
} from "../constants";
import { debug } from "../debug/debug";

function validateMove(
	fromSquare: TSquare,
	toSquare: TSquare,
	isWhite: boolean,
	board: TBoard,
): TValidationResult {
	const fromRank = Number.parseInt(fromSquare[1]);
	const toRank = Number.parseInt(toSquare[1]);
	const rankDiff = isWhite ? toRank - fromRank : fromRank - toRank;

	// Single step forward
	if (rankDiff === 1) {
		if (board[toSquare]) {
			return { valid: false, message: "Path is blocked" };
		}
		return { valid: true };
	}

	// Double step from starting position
	if (rankDiff === 2) {
		if ((isWhite && fromRank !== 2) || (!isWhite && fromRank !== 7)) {
			return { valid: false, message: "Invalid pawn move" };
		}

		const file = fromSquare[0];
		const intermediateRank = isWhite ? fromRank + 1 : fromRank - 1;
		const intermediateSquare = `${file}${intermediateRank}` as TSquare;

		if (board[intermediateSquare] || board[toSquare]) {
			return { valid: false, message: "Path is blocked" };
		}

		return { valid: true };
	}

	return { valid: false, message: "Invalid pawn move" };
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
		const expectedRank = isWhite ? 6 : 3;
		const actualRank = Number(toSquare[1]);

		if (actualRank !== expectedRank) {
			debug("moves", "Invalid: Wrong en passant capture square");
			return { valid: false, message: "Invalid en passant capture square" };
		}

		const lastMoveFileNum = lastMove.to[0].charCodeAt(0);
		const fromFileNum = from[0].charCodeAt(0);
		const targetFileNum = toSquare[0].charCodeAt(0);

		// Validate one square diagonal move
		if (Math.abs(targetFileNum - fromFileNum) !== 1) {
			return { valid: false, message: "Invalid en passant capture direction" };
		}

		// Validate capture is towards the captured pawn
		if (
			targetFileNum !==
			(lastMoveFileNum > fromFileNum ? fromFileNum + 1 : fromFileNum - 1)
		) {
			return { valid: false, message: "Invalid en passant capture direction" };
		}

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
	board: TBoard,
): TValidationResult {
	const isWhite = piece[0] === "w";

	if (toPiece || toSquare[0] !== fromSquare[0]) {
		return validateCapture(fromSquare, toPiece, toSquare, isWhite, history);
	}

	return validateMove(fromSquare, toSquare, isWhite, board);
}
