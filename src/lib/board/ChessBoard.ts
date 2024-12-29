import {
	type TBoard,
	type TPiece,
	type TSquare,
	initialPositions,
} from "../constants";

export class ChessBoard {
	private board: TBoard;

	constructor(board?: TBoard) {
		if (board) {
			this.board = board;
		} else {
			this.board = initialPositions;
		}
	}

	public getPieces(squares: TSquare[]) {
		return squares.map((square) => this.board[square]);
	}

	public setPieces(pieces: { square: TSquare; piece: TPiece | null }[]) {
		for (const { square, piece } of pieces) {
			this.board[square] = piece;
		}
	}

	public setBoard(board: TBoard): void {
		this.board = board;
	}

	public getBoard() {
		return this.board;
	}
}
