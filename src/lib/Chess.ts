import { isDraw } from "./board/draw";
import {
	detectPromotion,
	handleSpecialMove,
	isCheckmate,
	isStalemate,
	sharedValidation,
} from "./board/shared";
import { pieceValidation } from "./board/validation";
import {
	type TBoard,
	type TChessBoard,
	type TColor,
	type TEventHandlers,
	type TEventMap,
	type TGameState,
	type THistory,
	type THistoryMove,
	type TPiece,
	type TPromotionPiece,
	type TSpecialMove,
	type TSquare,
	type TValidationResult,
	promotionPieces,
} from "./constants";
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

	private applyMoveAndRecord({
		fromSquare,
		toSquare,
		piece,
		toPiece,
		specialMove,
	}: {
		fromSquare: TSquare;
		toSquare: TSquare;
		piece: TPiece;
		toPiece: TPiece | null;
		specialMove?: TSpecialMove;
	}) {
		// Update board
		const newBoard = { ...this.board };
		newBoard[fromSquare] = null;
		newBoard[toSquare] = piece;

		// Handle any special move (e.g. castling, en-passant)
		if (specialMove) {
			handleSpecialMove(newBoard, specialMove);
		}

		this.board = newBoard;

		// Switch sides
		this.currentColor = this.currentColor === "w" ? "b" : "w";

		// Write to history
		const historyMove: THistoryMove = {
			from: fromSquare,
			to: toSquare,
			piece,
			capture: !!toPiece,
			specialMove,
		};

		this.emit("onMove", historyMove);

		this.history = [...this.history, historyMove];
		this.currentMoveIndex = this.currentMoveIndex + 1;
		this.checkGameEnd();
	}

	public finalizePromotion(
		piece: TPromotionPiece,
		fromSquare: TSquare,
		toSquare: TSquare,
	): TValidationResult {
		// only allow right promotion pieces
		const validPromotionPieces = promotionPieces.filter(
			(p) => p[0] === this.currentColor,
		);

		if (!validPromotionPieces.includes(piece)) {
			console.error("Invalid promotion piece");
			return { valid: false, message: "Invalid promotion piece" };
		}

		this.applyMoveAndRecord({
			fromSquare,
			toSquare,
			piece,
			toPiece: null,
		});

		return { valid: true };
	}

	// replayIdx and specialMove are used only for navigating history - optional
	public setPiece({
		fromSquare,
		toSquare,
		piece,
		replayIdx,
		specialMove,
	}: {
		fromSquare: TSquare;
		toSquare: TSquare;
		piece: TPiece;
		replayIdx?: number;
		specialMove?: TSpecialMove;
	}) {
		// Game over check (unless replay)
		if (this.gameState !== "active" && replayIdx === undefined) {
			return {
				valid: false,
				message: `Game is over (${this.gameState})`,
			};
		}

		const isReplay = replayIdx !== undefined;
		const relevantHistory = isReplay
			? this.history.slice(0, replayIdx)
			: this.history;

		const isBrowsingHistory = this.currentMoveIndex < this.history.length - 1;

		// Prevent normal moves if browsing history and not replay
		if (isBrowsingHistory && !isReplay) return;

		// Avoid no-op move
		if (fromSquare === toSquare && !isReplay) return;

		const toPiece = this.getPiece(toSquare);

		// Only run validations if not replay and not browsing history
		if (!isReplay && !isBrowsingHistory) {
			const sharedValidationRes = sharedValidation({
				piece,
				toPiece,
				board: this.board,
				currentColor: this.currentColor,
				fromSquare,
				history: relevantHistory,
				toSquare,
			});
			if (!sharedValidationRes.valid) {
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

			// Only run promotion logic if not replay and not browsing history
			if (detectPromotion(piece, toSquare)) {
				this.emit("onPromotion", {
					fromSquare,
					toSquare,
					piece,
					state: this.getBoardState(),
				});
				return { valid: true };
			}

			// If passing validations, call applyMoveAndRecord
			this.applyMoveAndRecord({
				fromSquare,
				toSquare,
				piece,
				toPiece,
				specialMove,
			});

			return { valid: true };
		}

		// If it’s replay or browsing history, just apply minimal changes
		// (No validations, no new history)
		const newBoard = { ...this.board };
		newBoard[fromSquare] = null;
		newBoard[toSquare] = piece;

		// Handle any special move (e.g. castling, en-passant)
		if (specialMove) {
			handleSpecialMove(newBoard, specialMove);
		}

		this.board = newBoard;

		this.currentColor = this.currentColor === "w" ? "b" : "w";
		return { valid: true };
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
			this.setPiece({
				fromSquare: historyMove.from,
				toSquare: historyMove.to,
				piece: historyMove.piece,
				replayIdx: i,
				specialMove: historyMove.specialMove,
			});
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
