import type {
	TBoard,
	TColor,
	THistory,
	TPiece,
	TSquare,
	TValidationResult,
} from "../constants";
import { debug } from "../debug/debug";
import { isSquareUnderAttack } from "./isSquareUnderAttack"; // Assume this utility function checks if a square is under attack

function validateKingMove({
	currentColor,
	board,
	fromSquare,
	toSquare,
	history,
}: {
	currentColor: TColor;
	board: TBoard;
	fromSquare: TSquare;
	toSquare: TSquare;
	history: THistory;
}): TValidationResult {
	debug(
		"moves",
		`Validating ${currentColor} king move from ${fromSquare} to ${toSquare}`,
	);

	const fileDiff = Math.abs(fromSquare.charCodeAt(0) - toSquare.charCodeAt(0));
	const rankDiff = Math.abs(
		Number.parseInt(fromSquare[1]) - Number.parseInt(toSquare[1]),
	);

	debug("moves", "Move metrics:", { fileDiff, rankDiff });

	const isValidMove = fileDiff <= 1 && rankDiff <= 1;
	if (!isValidMove) {
		debug("moves", "Invalid: King moving more than one square");
		return {
			valid: false,
			message: "King can only move one square in any direction",
		};
	}

	debug("check", `Checking if square ${toSquare} is under attack`);
	if (isSquareUnderAttack({ board, currentColor, history, toSquare })) {
		debug("check", `Square ${toSquare} is under attack`);
		return {
			valid: false,
			message: "King cannot move to a square that is under attack",
		};
	}

	debug("moves", "Valid king move");
	return { valid: true };
}

function validateCastling({
	currentColor,
	board,
	toSquare,
	history,
}: {
	currentColor: TColor;
	board: TBoard;
	toSquare: TSquare;
	history: THistory;
}): TValidationResult {
	const isWhite = currentColor === "w";
	const rank = isWhite ? "1" : "8";
	debug("castle", `Validating ${currentColor} king castling to ${toSquare}`);

	const isKingSideCastling = toSquare === `g${rank}`;
	const isQueenSideCastling = toSquare === `c${rank}`;
	debug("castle", "Castling type:", {
		isKingSideCastling,
		isQueenSideCastling,
	});

	if (!isKingSideCastling && !isQueenSideCastling) {
		debug("castle", "Invalid: Not a castling move");
		return { valid: false, message: "Invalid castling move" };
	}

	const kingMoved = history.some((move) => move.piece === `${currentColor}k`);
	const rookSquare = isKingSideCastling ? `h${rank}` : `a${rank}`;
	const rookMoved = history.some(
		(move) => move.piece === `${currentColor}r` && move.from === rookSquare,
	);
	debug("castle", "Piece movement check:", {
		kingMoved,
		rookMoved,
		rookSquare,
	});

	if (kingMoved || rookMoved) {
		debug("castle", "Invalid: King or rook has moved");
		return {
			valid: false,
			message: "Cannot castle if the king or rook has moved",
		};
	}

	const squaresBetween = (
		isKingSideCastling
			? [`f${rank}`, `g${rank}`]
			: [`b${rank}`, `c${rank}`, `d${rank}`]
	) satisfies TSquare[];
	debug("castle", "Checking squares between:", squaresBetween);

	for (const square of squaresBetween) {
		if (board[square]) {
			debug("castle", `Invalid: Square ${square} is occupied`);
			return {
				valid: false,
				message: "Cannot castle through or into occupied squares",
			};
		}
	}

	const squaresToCheck = (
		isKingSideCastling
			? [`e${rank}`, `f${rank}`, `g${rank}`]
			: [`e${rank}`, `d${rank}`, `c${rank}`]
	) satisfies TSquare[];
	debug("castle", "Checking squares for attacks:", squaresToCheck);

	for (const square of squaresToCheck) {
		if (
			isSquareUnderAttack({ currentColor, board, toSquare: square, history })
		) {
			debug("castle", `Invalid: Square ${square} is under attack`);
			return {
				valid: false,
				message: "Cannot castle through or into squares under attack",
			};
		}
	}

	debug("castle", "Valid castling move");
	return {
		valid: true,
		specialMove: {
			type: "castling",
			rookFromSquare: (isKingSideCastling
				? `h${rank}`
				: `a${rank}`) satisfies TSquare,
			rookToSquare: (isKingSideCastling
				? `f${rank}`
				: `d${rank}`) satisfies TSquare,
		},
	};
}

export function validateKingPosition(props: {
	piece: TPiece;
	board: TBoard;
	fromSquare: TSquare;
	toSquare: TSquare;
	history: THistory;
}): TValidationResult {
	const currentColor = props.piece[0] === "w" ? "w" : "b";
	const rank = currentColor === "w" ? "1" : "8";

	debug(
		"moves",
		`Validating king position for ${currentColor} from ${props.fromSquare} to ${props.toSquare}`,
	);

	if (
		props.fromSquare === `e${rank}` &&
		(props.toSquare === `c${rank}` || props.toSquare === `g${rank}`)
	) {
		debug("castle", "Attempting castling validation");
		return validateCastling({
			currentColor,
			board: props.board,
			toSquare: props.toSquare,
			history: props.history,
		});
	}

	debug("moves", "Attempting normal king move validation");
	return validateKingMove({ ...props, currentColor });
}
