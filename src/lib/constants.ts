export type TColor = "w" | "b";
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

export const initialPositions: Record<TSquare, TPiece | null> = {
	a1: "wr",
	b1: "wn",
	c1: "wb",
	d1: "wq",
	e1: "wk",
	f1: "wb",
	g1: "wn",
	h1: "wr",
	a2: "wp",
	b2: "wp",
	c2: "wp",
	d2: "wp",
	e2: "wp",
	f2: "wp",
	g2: "wp",
	h2: "wp",
	a3: null,
	b3: null,
	c3: null,
	d3: null,
	e3: null,
	f3: null,
	g3: null,
	h3: null,
	a4: null,
	b4: null,
	c4: null,
	d4: null,
	e4: null,
	f4: null,
	g4: null,
	h4: null,
	a5: null,
	b5: null,
	c5: null,
	d5: null,
	e5: null,
	f5: null,
	g5: null,
	h5: null,
	a6: null,
	b6: null,
	c6: null,
	d6: null,
	e6: null,
	f6: null,
	g6: null,
	h6: null,
	a7: "bp",
	b7: "bp",
	c7: "bp",
	d7: "bp",
	e7: "bp",
	f7: "bp",
	g7: "bp",
	h7: "bp",
	a8: "br",
	b8: "bn",
	c8: "bb",
	d8: "bq",
	e8: "bk",
	f8: "bb",
	g8: "bn",
	h8: "br",
};

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

export type TSpecialMove =
	| TSpecialMoveEnPassant
	| TSpecialMoveCastling
	| TSpecialMovePromotion;

export type TValidationResult =
	| {
			valid: false;
			message: string;
			specialMove?: undefined;
	  }
	| {
			valid: true;
			message?: undefined;
			specialMove?: TSpecialMove;
	  };

export type THistoryMove = {
	from: TSquare;
	to: TSquare;
	piece: TPiece;
	capture?: boolean;
};

export type THistory = THistoryMove[];

export type TGameState = "active" | "checkmate" | "stalemate" | "draw";

export type TChessBoard = {
	board: TBoard;
	history: THistory;
	currentColor: TColor;
	currentMoveIndex: number;
	gameState: TGameState;
};

export const defaultState = {
	board: initialPositions,
	currentColor: "w",
	history: [],
	currentMoveIndex: -1,
	gameState: "active",
} satisfies TChessBoard;

export type TGameEndPayload =
	| { type: "checkmate"; winner: "white" | "black"; message?: undefined }
	| { type: "stalemate"; message: string; winner?: undefined }
	| {
			type: "draw";
			winner?: undefined;
			message: string;
	  };

export type TEventMap = {
	onGameEnd: TGameEndPayload;
	onMove: { from: TSquare; to: TSquare; piece: TPiece };
};

export type TEventName = keyof TEventMap;
export type TEventHandler<K extends TEventName> = (
	payload: TEventMap[K],
) => unknown;

export type TEventHandlers = Partial<{
	[K in keyof TEventMap]: (payload: TEventMap[K]) => unknown;
}>;

export const THREEFOLD_REPETITION_COUNT = 3;
export const MAX_MOVES_TO_CHECK = 8;
