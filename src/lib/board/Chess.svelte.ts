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
import { handleSpecialMove, undoSpecialMove } from "./common";
import { validatePawnPosition } from "./pawn";

export class ChessBoard {
	public board: TBoard = $state(initialPositions);
	public history: THistory = $state([]);
	public currentMoveIndex = $state(-1);

	public getPiece(square: TSquare): TPiece | null {
		return this.board[square];
	}

	public setPiece(
		originSquare: TSquare,
		targetSquare: TSquare,
		piece: TPiece,
	): boolean {
		const destinationPiece = this.getPiece(targetSquare);
		if (originSquare === targetSquare) return false;

		let specialMove:
			| TSpecialMoveEnPassant
			| TSpecialMoveCastling
			| TSpecialMovePromotion
			| undefined;

		if (piece === "bp" || piece === "wp") {
			const result = validatePawnPosition(
				piece,
				originSquare,
				destinationPiece,
				targetSquare,
				this.history,
			);

			if (!result.valid) return false;
			specialMove = result.specialMove;
		}

		const historyMove: THistoryMove = {
			from: originSquare,
			to: targetSquare,
			piece,
			capturedPiece: destinationPiece || undefined,
			specialMove,
		};

		this.board[originSquare] = null;
		this.board[targetSquare] = piece;

		if (specialMove) {
			handleSpecialMove(this.board, specialMove);
		}
		this.addMoveToHistory(historyMove);

		return true;
	}

	private addMoveToHistory(move: THistoryMove): void {
		if (this.currentMoveIndex < this.history.length - 1) {
			this.history = this.history.slice(0, this.currentMoveIndex + 1);
		}
		this.history.push(move);
		this.currentMoveIndex = this.history.length - 1;
	}

	public setBoard(board: TBoard): void {
		this.board = { ...board };
	}

	public goToMove(moveIndex: number): void {
		if (moveIndex < -1 || moveIndex >= this.history.length) {
			throw new Error("Invalid move index");
		}

		if (moveIndex === this.currentMoveIndex) return;

		if (moveIndex === -1) {
			this.board = { ...initialPositions };
			this.currentMoveIndex = -1;
			return;
		}

		const isMovingBackwards = moveIndex < this.currentMoveIndex;
		const start = isMovingBackwards ? this.currentMoveIndex : moveIndex;
		const end = isMovingBackwards ? moveIndex : this.currentMoveIndex;

		for (let i = start; i !== end; i += isMovingBackwards ? -1 : 1) {
			isMovingBackwards ? this.undoMove() : this.redoMove();
		}
	}

	private undoMove(): void {
		if (this.currentMoveIndex < 0) return;

		const move = this.history[this.currentMoveIndex];
		this.board[move.from] = move.piece;
		this.board[move.to] = move.capturedPiece || null;

		if (move.specialMove) {
			undoSpecialMove(this.board, move.specialMove);
		}

		this.currentMoveIndex--;
	}

	private redoMove(): void {
		if (this.currentMoveIndex >= this.history.length - 1) return;

		this.currentMoveIndex++;
		const move = this.history[this.currentMoveIndex];
		this.board[move.from] = null;
		this.board[move.to] = move.piece;

		if (move.specialMove) {
			handleSpecialMove(this.board, move.specialMove);
		}
	}
}
