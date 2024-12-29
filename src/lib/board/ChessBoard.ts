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

	public getPiece(square: TSquare) {
		return this.board[square];
	}

	public setPiece(square: TSquare, piece: TPiece | null) {
		this.board[square] = piece;
	}

	public setBoard(board: TBoard): void {
		this.board = board;
	}

	public getBoard() {
		return this.board;
	}
}
