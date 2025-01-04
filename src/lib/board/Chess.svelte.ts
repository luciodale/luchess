import {
	type TBoard,
	type THistory,
	type THistoryMove,
	type TPiece,
	type TSpecialMoveCastling,
	type TSpecialMoveEnPassant,
	type TSpecialMovePromotion,
	type TSquare,
	initialPositions,
} from "../constants";
import { objectEntries } from "../utils";
import { handleSpecialMove } from "./common";
import { validatePawnPosition } from "./pawn";

export class ChessBoard {
	public board: TBoard = $state(initialPositions);
	public history: THistory = $state([]);
	public currentMoveIndex = $state(-1);

	public getPiece(square: TSquare): TPiece | null {
		return this.board[square];
	}

	public setPiece(from: TSquare, to: TSquare, piece: TPiece, isReplay = false) {
		const destinationPiece = this.getPiece(to);

		const isBrowsingHistory = this.currentMoveIndex < this.history.length - 1;

		// can't make a move if browsing history
		if (isBrowsingHistory && !isReplay) return;
		if (from === to) return;

		let specialMove:
			| TSpecialMoveEnPassant
			| TSpecialMoveCastling
			| TSpecialMovePromotion
			| undefined;

		const relevantHistory =
			isBrowsingHistory || isReplay
				? this.history.slice(0, this.currentMoveIndex)
				: this.history;

		if (piece === "bp" || piece === "wp") {
			const result = validatePawnPosition(
				piece,
				from,
				destinationPiece,
				to,
				relevantHistory,
			);

			if (!result.valid) return;
			specialMove = result.specialMove;
		}

		this.board[from] = null;
		this.board[to] = piece;

		if (specialMove) {
			handleSpecialMove(this.board, specialMove);
		}

		// only add move to history if it's a new move and not a replay
		if (!isReplay && !isBrowsingHistory) {
			const historyMove: THistoryMove = {
				from,
				to,
				piece,
			};

			this.history.push(historyMove);
			this.currentMoveIndex++;
		}
	}

	private resetBoard() {
		for (const [square, piece] of objectEntries(initialPositions)) {
			this.board[square] = piece;
		}
	}

	private replayMoves() {
		this.resetBoard();

		for (let i = 0; i <= this.currentMoveIndex; i++) {
			const historyMove = this.history[i];
			this.setPiece(historyMove.from, historyMove.to, historyMove.piece, true);
		}
	}

	public undo() {
		if (this.currentMoveIndex < 0) return;
		this.currentMoveIndex--;
		this.replayMoves();
	}

	public redo() {
		if (this.currentMoveIndex >= this.history.length - 1) return;
		this.currentMoveIndex++;
		this.replayMoves();
	}
}
