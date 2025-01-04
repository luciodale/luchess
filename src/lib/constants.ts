export type TColor = "white" | "black";
export type TFile = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
export type TRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type TSquare = `${TFile}${TRank}`;

export type TPawn = "bp" | "wp";
export type TKnight = "bn" | "wn";
export type TBishop = "bb" | "wb";
export type TRook = "br" | "wr";
export type TQueen = "bq" | "wq";
export type TKing = "bk" | "wk";

export type TPiece = TPawn | TKnight | TBishop | TRook | TQueen | TKing;

export const files = [
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
] as const satisfies TFile[];

export const ranks = [1, 2, 3, 4, 5, 6, 7, 8] as const satisfies TRank[];

export type TBoard = Record<TSquare, TPiece | null>;

const whitePieces = [
	"wr",
	"wn",
	"wb",
	"wq",
	"wk",
	"wb",
	"wn",
	"wr",
] satisfies TPiece[];
const blackPieces = [
	"br",
	"bn",
	"bb",
	"bq",
	"bk",
	"bb",
	"bn",
	"br",
] satisfies TPiece[];

export function getInitialPositions(
	color: TColor,
): Record<TSquare, TPiece | null> {
	const initialPositions: TBoard = {} as TBoard;
	const isWhite = color === "white";

	// Set up pawns
	for (const file of files) {
		initialPositions[`${file}2`] = isWhite ? "wp" : "bp";
		initialPositions[`${file}7`] = isWhite ? "bp" : "wp";
	}

	// Set up other pieces
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		initialPositions[`${file}1`] = isWhite ? whitePieces[i] : blackPieces[i];
		initialPositions[`${file}8`] = isWhite ? blackPieces[i] : whitePieces[i];
	}

	// Set up empty squares
	for (let rank = ranks[2]; rank <= ranks[5]; rank++) {
		for (const file of files) {
			initialPositions[`${file}${rank}`] = null;
		}
	}

	return initialPositions;
}

export type TSpecialMoveEnPassant = {
	type: "enPassant";
	destinationPieceSquare: TSquare;
	rookFromSquare?: undefined;
	rookToSquare?: undefined;
	promotedTo?: undefined;
};

export type TSpecialMoveCastling = {
	type: "castling";
	destinationPieceSquare?: undefined;
	rookFromSquare: TSquare;
	rookToSquare: TSquare;
	promotedTo?: undefined;
};

export type TSpecialMovePromotion = {
	type: "promotion";
	promotedTo: TKnight | TBishop | TRook | TQueen;
	destinationPieceSquare?: undefined;
	rookFromSquare?: undefined;
	rookToSquare?: undefined;
};

export type TValidationResult =
	| {
			valid: false;
			message: string;
			specialMove?: undefined;
	  }
	| {
			valid: true;
			message?: undefined;
			specialMove?:
				| TSpecialMoveEnPassant
				| TSpecialMoveCastling
				| TSpecialMovePromotion;
	  };

export type THistoryMove = {
	from: TSquare;
	to: TSquare;
	piece: TPiece;
};

export type THistory = THistoryMove[];
