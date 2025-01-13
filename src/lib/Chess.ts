import { isDraw } from "./board/draw";
import {
	handleSpecialMove,
	isCheckmate,
	isStalemate,
	sharedValidation,
} from "./board/shared";
import { pieceValidation } from "./board/validation";
import type {
	TBoard,
	TChessBoard,
	TColor,
	TEventHandlers,
	TEventMap,
	TGameState,
	THistory,
	THistoryMove,
	TPiece,
	TSquare,
} from "./constants";
import { debug } from "./debug/debug";
import { objectEntries } from "./utils";

export class ChessBoard {
	private getBoardState: () => TChessBoard;
	private setBoardState: (newState: TChessBoard) => unknown;
	private initialBoard: TBoard;
	private eventHandlers?: TEventHandlers;

	constructor({
		getBoardState,
		setBoardState,
		eventHandlers,
	}: {
		getBoardState: () => TChessBoard;
		setBoardState: (newState: TChessBoard) => unknown;
		eventHandlers?: TEventHandlers;
	}) {
		this.getBoardState = getBoardState;
		this.setBoardState = setBoardState;
		this.initialBoard = getBoardState().board;

		this.setBoardState({
			...this.getBoardState(),
			gameState: "active",
		});

		if (eventHandlers) {
			this.eventHandlers = eventHandlers;
		}
	}

	public get board(): TBoard {
		return this.getBoardState().board;
	}

	private set board(newBoard: TBoard) {
		this.setBoardState({ ...this.getBoardState(), board: newBoard });
	}

	public get currentColor(): TColor {
		return this.getBoardState().currentColor;
	}

	private set currentColor(newColor: TColor) {
		this.setBoardState({ ...this.getBoardState(), currentColor: newColor });
	}

	public get history(): THistory {
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

	private get gameState(): TGameState {
		return this.getBoardState().gameState;
	}

	private set gameState(newState: TGameState) {
		this.setBoardState({ ...this.getBoardState(), gameState: newState });
	}

	public on<K extends keyof TEventMap>(
		event: K,
		handler: (payload: TEventMap[K]) => void,
	) {
		if (!this.eventHandlers) {
			this.eventHandlers = {};
		}
		this.eventHandlers[event] = handler as TEventHandlers[K];
	}

	private emit<K extends keyof TEventMap>(event: K, payload: TEventMap[K]) {
		const handler = this.eventHandlers?.[event];
		if (handler) {
			handler(payload);
		}
	}

	// Game State Checks
	private checkGameEnd() {
		if (isCheckmate(this.board, this.currentColor, this.history)) {
			this.gameState = "checkmate";
			this.emit("onGameEnd", {
				type: "checkmate",
				winner: this.currentColor === "w" ? "black" : "white",
			});
			return;
		}

		if (isStalemate(this.board, this.currentColor, this.history)) {
			this.gameState = "stalemate";
			this.emit("onGameEnd", {
				type: "stalemate",
				message: "Game ended in stalemate",
			});
		}

		if (isDraw(this.board, this.history)) {
			this.gameState = "draw";
			this.emit("onGameEnd", {
				type: "draw",
				message: "Game ended in draw",
			});
		}
	}

	public setPiece(
		fromSquare: TSquare,
		toSquare: TSquare,
		piece: TPiece,
		replayIdx?: number, // Optional parameter for replay index
	) {
		// Don't allow moves if game is over
		if (this.gameState !== "active" && !replayIdx) {
			return {
				valid: false,
				message: `Game is over (${this.gameState})`,
			};
		}

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

		const sharedValidationRes = sharedValidation({
			piece,
			toPiece,
			board: this.board,
			currentColor: this.currentColor,
			fromSquare,
			history: relevantHistory,
			toSquare,
		});

		if (!isReplay && !sharedValidationRes.valid) {
			console.error(sharedValidationRes.message);
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
			return { valid, message };
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
				capture: !!toPiece,
			};

			this.emit("onMove", historyMove);

			this.history = [...this.history, historyMove];
			this.currentMoveIndex = this.currentMoveIndex + 1;
			this.checkGameEnd();

			return { valid: true };
		}
	}

	private resetBoard() {
		const newBoard = { ...this.board };
		for (const [square, piece] of objectEntries(this.initialBoard)) {
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

	public setFreeMode(positions: Partial<Record<TSquare, TPiece | null>>) {
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
