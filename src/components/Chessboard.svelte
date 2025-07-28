<script lang="ts">
import { onMount } from "svelte";
import { ChessBoard } from "../lib/Chess.js";
import {
	type TChessBoard,
	type TColor,
	type TDragState,
	type TPromotionPiece,
	type TSquare,
	defaultDragState,
	defaultState,
} from "../lib/constants.js";
import {
	handleBoardMouseDown,
	handleBoardMouseUp,
} from "../lib/ui/handleBoardClick.js";
import { handleDragPiece } from "../lib/ui/handleDragPiece";
import { objectEntries } from "../lib/utils";
import "../style.css";
import Coordinates from "./Coordinates.svelte";

type Props = {
	orientation: "w" | "b";
};

type TPromotion = {
	visible: boolean;
	color?: TColor;
	position?: "top" | "bottom";
	fromSquare?: TSquare;
	toSquare?: TSquare;
	transform?: string;
};

const { orientation }: Props = $props();

let boardNode: HTMLElement;

const boardState: TChessBoard = $state({
	...defaultState,
	currentColor: "w",
});

const dragState: TDragState = $state(defaultDragState);

const promotion: TPromotion = $state({
	visible: false,
});

const chessBoard = new ChessBoard({
	getBoardState: () => boardState,
	setBoardState: (newState) => {
		boardState.board = newState.board;
		boardState.currentColor = newState.currentColor;
		boardState.history = newState.history;
		boardState.currentMoveIndex = newState.currentMoveIndex;
	},
	eventHandlers: {
		onPromotion: ({ fromSquare, toSquare, state }) => {
			console.log("Promotion: ", toSquare);

			// Figure out if it should go on top or bottom. For example:
			// If orientation is "w" and rank is "8", it's near top
			const rank = Number(toSquare[1]);
			const isTop = orientation === "w" ? rank === 8 : rank === 1;

			promotion.position = isTop ? "top" : "bottom";
			promotion.color = state.currentColor;
			promotion.toSquare = toSquare;
			promotion.fromSquare = fromSquare;

			// Calculate the horizontal translateX based on file (a-h) and orientation.
			const fileLetter = toSquare[0]; // e.g. "a", "b", ...
			const fileIndex = fileLetter.charCodeAt(0) - "a".charCodeAt(0); // 0..7
			console.log("in here", fileLetter, fileIndex);
			// Account for board orientation - when black perspective, files are reversed
			const adjustedFileIndex = orientation === "w" ? fileIndex : 7 - fileIndex;
			promotion.transform = `translateX(${adjustedFileIndex * 100}%)`;

			promotion.visible = true;
		},
		onMove: (move) => {
			console.log("Move: ", move);
		},

		onGameEnd: (result) => {
			console.log("Game End: ", result);
		},
	},
});

$inspect(boardState.board);

// history navigation

function handleKeydown(event: KeyboardEvent) {
	if (event.key === "ArrowRight") {
		chessBoard.redo();
	} else if (event.key === "ArrowLeft") {
		chessBoard.undo();
	}
}

function choosePromotionPiece(piece: TPromotionPiece) {
	if (!promotion.toSquare || !promotion.fromSquare) return;

	const res = chessBoard.finalizePromotion(
		piece,
		promotion.fromSquare,
		promotion.toSquare,
	);

	if (res) {
		promotion.visible = false;
	}
}

function closePromotionWindow() {
	promotion.visible = false;
	promotion.toSquare = undefined;
	promotion.fromSquare = undefined;
	promotion.color = undefined;
	promotion.position = undefined;
	promotion.transform = undefined;
}

onMount(() => {
	window.addEventListener("keydown", handleKeydown);
	return () => {
		window.removeEventListener("keydown", handleKeydown);
	};
});

const lastMove = $derived(boardState.history[boardState.currentMoveIndex]);
</script>

<div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
<div style="padding: 50px 0; position: relative; max-width:700px; width: 100%;">
  <div
    class="board"
    bind:this={boardNode}
    role="button"
    tabindex="0"
    ontouchend={(e) => {
      handleBoardMouseUp({
        e,
        chessBoard,
        dragState,
        boardNode,
        orientation,
      });
    }}
    ontouchstart={(e) => {
      handleBoardMouseDown({
        e,
        chessBoard,
        dragState,
        boardNode,
        orientation,
      });
    }}
    onmouseup={(e) => {
      handleBoardMouseUp({
        e,
        chessBoard,
        dragState,
        boardNode,
        orientation,
      });
    }}
    onmousedown={(e) => {
      handleBoardMouseDown({
        e,
        chessBoard,
        dragState,
        boardNode,
        orientation,
      });
    }}
  >
    {#if promotion.visible}
      <div>
        <!-- Use promotion.position to toggle className "top" or "bottom" 
         Use promotion.transform for inline style -->
        <div
          class="promotion-window {promotion.position}"
          style="transform: {promotion.transform}"
        >
        
          <div class="close-button" onclick={closePromotionWindow}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>

          <!-- If color is 'b', display black promotion pieces. Otherwise white. -->
          {#if promotion.color === "b"}
            <div
              class="promotion-piece bb"
              onclick={() => choosePromotionPiece("bb")}
            ></div>
            <div
              class="promotion-piece bn"
              onclick={() => choosePromotionPiece("bn")}
            ></div>
            <div
              class="promotion-piece bq"
              onclick={() => choosePromotionPiece("bq")}
            ></div>
            <div
              class="promotion-piece br"
              onclick={() => choosePromotionPiece("br")}
            ></div>
          {:else}
            <div
              class="promotion-piece wb"
              onclick={() => choosePromotionPiece("wb")}
            ></div>
            <div
              class="promotion-piece wn"
              onclick={() => choosePromotionPiece("wn")}
            ></div>
            <div
              class="promotion-piece wq"
              onclick={() => choosePromotionPiece("wq")}
            ></div>
            <div
              class="promotion-piece wr"
              onclick={() => choosePromotionPiece("wr")}
            ></div>
          {/if}
        </div>
      </div>
    {/if}
    <!-- coordinates -->
    <Coordinates {orientation} />

    <!-- highlights showing last move -->
    {#if lastMove?.from}
      <div class={`${orientation} highlight square-${lastMove.from}`}></div>
    {/if}
    {#if lastMove?.to}
      <div class={`${orientation} highlight square-${lastMove.to}`}></div>
    {/if}

    <!-- moving piece highlight + hints -->
    {#if dragState.piece}
      <div class={`${orientation} highlight square-${dragState.square}`}></div>
    {/if}
    {#each dragState.validMoves as move}
      <div
        class={`${orientation} ${move.isCapture ? "capture-hint" : "hint"} square-${move.square}`}
      ></div>
    {/each}

    <!-- board pieces -->
    {#each objectEntries(boardState.board) as [square, piece]}
      {#if piece && !(promotion.visible && square === promotion.fromSquare)}
        <button
          class={`piece ${piece} ${orientation} square-${square}`}
          aria-label={`${square}-${piece}`}
          ontouchstart={(e) =>
            handleDragPiece({
              e,
              chessBoard,
              piece,
              square,
              boardNode,
              orientation,
              dragState,
            })}
          onmousedown={(e) =>
            handleDragPiece({
              e,
              chessBoard,
              piece,
              square,
              boardNode,
              orientation,
              dragState,
            })}
        ></button>
      {/if}
    {/each}
  </div>
</div>

<div class="controls">
  <button onclick={() => chessBoard.undo()}> Previous </button>
  <span>{boardState.currentMoveIndex}</span>
  <button onclick={() => chessBoard.redo()}> Next </button>
</div>
</div>