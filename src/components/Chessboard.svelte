<script lang="ts">
  import { onMount } from "svelte";
  import { ChessBoard } from "../lib/Chess.js";
  import {
    type TChessBoard,
    type TDragState,
    defaultDragState,
    defaultState,
  } from "../lib/constants.js";
  import { handleDragPiece } from "../lib/ui/handleDragPiece";
  import { objectEntries } from "../lib/utils";
  import "../style.css";
  import Coordinates from "./Coordinates.svelte";

  type Props = {
    color: "w" | "b";
  };

  const { color }: Props = $props();

  let boardNode: HTMLElement;

  const boardState: TChessBoard = $state({
    ...defaultState,
    currentColor: "w",
  });

  const dragState: TDragState = $state(defaultDragState);

  const chessBoard = new ChessBoard({
    getBoardState: () => boardState,
    setBoardState: (newState) => {
      boardState.board = newState.board;
      boardState.currentColor = newState.currentColor;
      boardState.history = newState.history;
      boardState.currentMoveIndex = newState.currentMoveIndex;
    },
    eventHandlers: {
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

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  const lastMove = $derived(boardState.history[boardState.currentMoveIndex]);
</script>

<div style="padding: 50px 0; position: relative; width: 600px">
  <div class="board" bind:this={boardNode}>
    <!-- coordinates -->
    <Coordinates {color} />

    <!-- highlights showing last move -->
    {#if lastMove?.from}
      <div class={`${color} highlight square-${lastMove.from}`}></div>
    {/if}
    {#if lastMove?.to}
      <div class={`${color} highlight square-${lastMove.to}`}></div>
    {/if}

    <!-- moving piece highlight + hints -->
    {#if dragState.piece}
      <div class={`${color} highlight square-${dragState.square}`}></div>
    {/if}
    {#each dragState.validMoves as move}
      <div
        class={`${color} ${move.isCapture ? "capture-hint" : "hint"} square-${move.square}`}
      ></div>
    {/each}

    <!-- board pieces -->
    {#each objectEntries(boardState.board) as [square, piece]}
      {#if piece}
        <button
          class={`piece ${piece} ${color} square-${square}`}
          aria-label={`${square}-${piece}`}
          ontouchstart={(e) =>
            handleDragPiece({
              e,
              chessBoard,
              piece,
              square,
              boardNode,
              color,
              dragState,
            })}
          onmousedown={(e) =>
            handleDragPiece({
              e,
              chessBoard,
              piece,
              square,
              boardNode,
              color,
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
