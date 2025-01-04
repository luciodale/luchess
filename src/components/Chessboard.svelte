<script lang="ts">
  import { onMount } from "svelte";
  import { ChessBoard } from "../lib/board/Chess.svelte.js";
  import { handleDragPiece } from "../lib/ui/handleDragPiece";
  import { objectEntries } from "../lib/utils";
  import "../style.css";
  import Coordinates from "./Coordinates.svelte";

  let boardNode: HTMLElement;

  const chessBoard = new ChessBoard();

  const chessBoardState = chessBoard.board;
  const history = chessBoard.history;
  const currentMoveIndex = chessBoard.currentMoveIndex;

  $inspect(history);

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
</script>

<div style="padding: 50px 0; position: relative; width: 600px">
  <div class="board" bind:this={boardNode}>
    <Coordinates />

    <div class="element-pool"></div>
    {#each objectEntries(chessBoardState) as [square, piece]}
      {#if piece}
        <button
          class={`piece ${piece} square-${square}`}
          aria-label={`${square}-${piece}`}
          ontouchstart={(e) =>
            handleDragPiece(e, chessBoard, piece, square, boardNode)}
          onmousedown={(e) =>
            handleDragPiece(e, chessBoard, piece, square, boardNode)}
        ></button>
      {/if}
    {/each}
  </div>
</div>

<div class="controls">
  <button onclick={() => chessBoard.undo()}> Previous </button>
  <span>{currentMoveIndex}</span>
  <button onclick={() => chessBoard.redo()}> Next </button>
</div>

<style>
  .board {
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 1 / 1;
    background-image: url("/images/chessboard.png");
    background-size: 100%;
    background-repeat: no-repeat;
  }

  .controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    gap: 1rem;
  }
</style>
