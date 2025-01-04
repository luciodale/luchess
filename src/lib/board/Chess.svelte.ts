import {
	type TBoard,
	type TColor,
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
import { handleSpecialMove, validatePieceColor } from "./common";
import { validatePawnPosition } from "./pawn";

export class ChessBoard {
	public board: TBoard = $state(initialPositions);
	public currentColor: TColor = $state("w");
	public history: THistory = $state([]);
	public currentMoveIndex = $state(-1);

	public getPiece(square: TSquare): TPiece | null {
		return this.board[square];
	}

	public setPiece(
		from: TSquare,
		to: TSquare,
		piece: TPiece,
		replayIdx?: number, // Optional parameter for replay index
	) {
		const destinationPiece = this.getPiece(to);

		// Determine if we are replaying based on replayIdx
		const isReplay = replayIdx !== undefined;

		const relevantHistory = isReplay
			? this.history.slice(0, replayIdx) // Use only history up to the provided index
			: this.history;

		const isBrowsingHistory = this.currentMoveIndex < this.history.length - 1;

		// Prevent moves if browsing history and not a replay
		if (isBrowsingHistory && !isReplay) return;
		if (from === to) return;

		const colorValidation = validatePieceColor(piece, this.currentColor);

		// we don't want to valid color if we are replaying
		if (!isReplay && !colorValidation.valid) {
			return colorValidation;
		}

		let specialMove:
			| TSpecialMoveEnPassant
			| TSpecialMoveCastling
			| TSpecialMovePromotion
			| undefined;

		if (piece === "bp" || piece === "wp") {
			const result = validatePawnPosition(
				piece,
				from,
				destinationPiece,
				to,
				relevantHistory,
			);

			if (!result.valid) {
				console.error(result.message);
				return;
			}
			specialMove = result.specialMove;
		}

		this.board[from] = null;
		this.board[to] = piece;
		this.currentColor = this.currentColor === "w" ? "b" : "w";

		if (specialMove) {
			handleSpecialMove(this.board, specialMove);
		}

		// Add move to history if it's not a replay
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
