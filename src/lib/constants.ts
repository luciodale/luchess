export type TFile = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
export type TRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type TSquare = `${TFile}${TRank}`;

export type TPiece =
	| "br"
	| "bn"
	| "bb"
	| "bq"
	| "bk"
	| "bp"
	| "wr"
	| "wn"
	| "wb"
	| "wq"
	| "wk"
	| "wp";

export const files: TFile[] = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const ranks: TRank[] = [1, 2, 3, 4, 5, 6, 7, 8];

export type TBoard = Record<TSquare, TPiece | null>;

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
