import { handleSpecialMove, sharedValidation } from "./board/common";
import { pieceValidation } from "./board/validation";
import {
	type TBoard,
	type TChessBoard,
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
	private getBoardState: () => TChessBoard;
	private setBoardState: (newState: TChessBoard) => unknown;

	constructor({
		getBoardState,
		setBoardState,
	}: {
		getBoardState: () => TChessBoard;
		setBoardState: (newState: TChessBoard) => unknown;
	}) {
		this.getBoardState = getBoardState;
		this.setBoardState = setBoardState;
	}

	private get board(): TBoard {
		return this.getBoardState().board;
	}

	private set board(newBoard: TBoard) {
		this.setBoardState({ ...this.getBoardState(), board: newBoard });
	}

	private get currentColor(): TColor {
		return this.getBoardState().currentColor;
	}

	private set currentColor(newColor: TColor) {
		this.setBoardState({ ...this.getBoardState(), currentColor: newColor });
	}

	private get history(): THistory {
		return this.getBoardState().history;
	}

	private set history(newHistory: THistory) {
		this.setBoardState({ ...this.getBoardState(), history: newHistory });
	}

	private get currentMoveIndex(): number {
		return this.getBoardState().currentMoveIndex;
	}

	private set currentMoveIndex(newIndex: number) {
		this.setBoardState({ ...this.getBoardState(), currentMoveIndex: newIndex });
	}

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

		const newBoard = { ...this.board };
		newBoard[fromSquare] = null;
		newBoard[toSquare] = piece;
		this.board = newBoard;

		this.currentColor = this.currentColor === "w" ? "b" : "w";

		if (specialMove) {
			handleSpecialMove(newBoard, specialMove);
			this.board = newBoard;
		}

		// Add move to history if it's not a replay
		if (!isReplay && !isBrowsingHistory) {
			const historyMove: THistoryMove = {
				from: fromSquare,
				to: toSquare,
				piece,
			};

			this.history = [...this.history, historyMove];
			this.currentMoveIndex = this.currentMoveIndex + 1;
		}
	}

	private resetBoard() {
		const newBoard = { ...this.board };
		for (const [square, piece] of objectEntries(initialPositions)) {
			newBoard[square] = piece;
		}
		this.board = newBoard;
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
		this.currentMoveIndex = this.currentMoveIndex - 1;
		this.replayMoves();
	}

	public redo() {
		if (this.currentMoveIndex >= this.history.length - 1) return;
		this.currentMoveIndex = this.currentMoveIndex + 1;
		this.replayMoves();
	}

	public setFreeMode(positions: Partial<Record<TSquare, TPiece>>) {
		const newBoard = { ...this.board };
		for (const [square, piece] of objectEntries(positions)) {
			if (piece === undefined) {
				newBoard[square] = null;
				continue;
			}
			newBoard[square] = piece;
		}
		this.board = newBoard;
	}
}
