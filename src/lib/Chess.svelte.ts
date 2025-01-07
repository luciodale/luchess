import { handleSpecialMove, sharedValidation } from "./board/common";
import { pieceValidation } from "./board/validation";
import {
	type TBoard,
	type TColor,
	type THistory,
	type THistoryMove,
	type TPiece,
	type TSquare,
	initialPositions,
} from "./constants";
import { debug } from "./debug/debug";
import { objectEntries } from "./utils";

export class ChessBoard {
	public board: TBoard = $state(initialPositions);
	public currentColor: TColor = $state("w");
	public history: THistory = $state([]);
	public currentMoveIndex = $state(-1);

	public getPiece(square: TSquare): TPiece | null {
		return this.board[square];
	}

	public setPiece(
		fromSquare: TSquare,
		toSquare: TSquare,
		piece: TPiece,
		replayIdx?: number, // Optional parameter for replay index
	) {
		const toPiece = this.getPiece(toSquare);

		// Determine if we are replaying based on replayIdx
		const isReplay = replayIdx !== undefined;

		const relevantHistory = isReplay
			? this.history.slice(0, replayIdx) // Use only history up to the provided index
			: this.history;

		const isBrowsingHistory = this.currentMoveIndex < this.history.length - 1;

		// Prevent drag and drop move in the middle of history
		if (isBrowsingHistory && !isReplay) return;
		if (fromSquare === toSquare) return;

		const sharedValidationRes = sharedValidation(
			piece,
			toPiece,
			this.currentColor,
		);

		// We don't want to run shared validation if we are replaying
		if (!isReplay && !sharedValidationRes.valid) {
			return sharedValidationRes;
		}

		const { valid, message, specialMove } = pieceValidation({
			piece,
			toPiece,
			fromSquare,
			toSquare,
			history: relevantHistory,
			board: this.board,
		});

		if (!valid) {
			console.error(message);
			return message;
		}

		debug("board", `Moving ${piece} from ${fromSquare} to ${toSquare}`);
		debug("board", "new board", this.board);

		this.board[fromSquare] = null;
		this.board[toSquare] = piece;
		this.currentColor = this.currentColor === "w" ? "b" : "w";

		if (specialMove) {
			handleSpecialMove(this.board, specialMove);
		}

		// Add move to history if it's not a replay
		if (!isReplay && !isBrowsingHistory) {
			const historyMove: THistoryMove = {
				from: fromSquare,
				to: toSquare,
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
			this.setPiece(historyMove.from, historyMove.to, historyMove.piece, i);
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
