import type {
	THistory,
	TPawn,
	TPiece,
	TSquare,
	TValidationResult,
} from "../constants";
import { validateSameColorCapture } from "./common";

function validateMove(
	from: TSquare,
	destinationSquare: TSquare,
	isWhite: boolean,
): TValidationResult {
	const originRank = Number(from[1]);
	const destinationRank = Number(destinationSquare[1]);

	if (isWhite) {
		if (destinationRank <= originRank) {
			return { valid: false, message: "White pawn can't move backward" };
		}
		if (originRank === 2) {
			if (destinationRank !== 3 && destinationRank !== 4) {
				return {
					valid: false,
					message:
						"White pawn can only move one square forward, or two squares forward from its initial position",
				};
			}
		} else {
			if (destinationRank !== originRank + 1) {
				return {
					valid: false,
					message: "White pawn can only move one square forward",
				};
			}
		}
	} else {
		if (destinationRank >= originRank) {
			return { valid: false, message: "Black pawn can't move backward" };
		}
		if (originRank === 7) {
			if (destinationRank !== 6 && destinationRank !== 5) {
				return {
					valid: false,
					message:
						"Black pawn can only move one square forward, or two squares forward from its initial position",
				};
			}
		} else {
			if (destinationRank !== originRank - 1) {
				return {
					valid: false,
					message: "Black pawn can only move one square forward",
				};
			}
		}
	}
	return { valid: true };
}

function validateCapture(
	from: TSquare,
	destinationPiece: TPiece | null,
	destinationSquare: TSquare,
	isWhite: boolean,
	history: THistory,
): TValidationResult {
	const isDiagonal = destinationSquare[0] !== from[0];

	if (isDiagonal) {
		if (
			!destinationPiece ||
			(isWhite && destinationPiece[0] !== "b") ||
			(!isWhite && destinationPiece[0] !== "w")
		) {
			// Check for en passant capture
			if (history.length > 0) {
				const lastMove = history[history.length - 1];
				const {
					piece: prevPiece,
					from: prevSquareFrom,
					to: prevSquareTo,
				} = lastMove;

				const originFile = from[0];
				const originRank = Number(from[1]);
				const destFile = destinationSquare[0];
				const destRank = Number(destinationSquare[1]);

				const prevMoveFromRank = Number(prevSquareFrom[1]);
				const prevMoveToRank = Number(prevSquareTo[1]);
				const prevMoveToFile = prevSquareTo[0];

				// Check if the previous move was a two-square pawn move of the opposite color
				if (
					prevPiece[1] === "p" &&
					Math.abs(prevMoveFromRank - prevMoveToRank) === 2 &&
					prevMoveToFile === destFile &&
					((isWhite && originRank === 5 && destRank === 6) ||
						(!isWhite && originRank === 4 && destRank === 3)) &&
					Math.abs(originFile.charCodeAt(0) - prevMoveToFile.charCodeAt(0)) ===
						1
				) {
					return {
						valid: true,
						specialMove: {
							type: "enPassant",
							destinationPieceSquare: prevSquareTo,
						},
					};
				}
			}

			return {
				valid: false,
				message: `${isWhite ? "White" : "Black"} pawn can only capture ${
					isWhite ? "black" : "white"
				} pieces diagonally`,
			};
		}
	} else {
		if (destinationPiece) {
			return {
				valid: false,
				message: `${
					isWhite ? "White" : "Black"
				} pawn can't capture a piece in front of it`,
			};
		}
	}

	return { valid: true };
}

export function validatePawnPosition(
	originPiece: TPawn,
	from: TSquare,
	destinationPiece: TPiece | null,
	destinationSquare: TSquare,
	history: THistory,
): TValidationResult {
	const isWhite = originPiece[0] === "w";

	const sameColorCaptureResult = validateSameColorCapture(
		originPiece,
		destinationPiece,
		isWhite,
	);

	if (!sameColorCaptureResult.valid) {
		return sameColorCaptureResult;
	}

	const moveResult = validateMove(from, destinationSquare, isWhite);
	if (!moveResult.valid) {
		return moveResult;
	}

	const captureResult = validateCapture(
		from,
		destinationPiece,
		destinationSquare,
		isWhite,
		history,
	);
	if (!captureResult.valid) {
		return captureResult;
	}

	return captureResult;
}
