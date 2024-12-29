<script lang="ts">
  import { ChessBoard } from "../lib/board/ChessBoard";
  import { initialPositions } from "../lib/constants";
  import { handleDragPiece } from "../lib/ui/handleDragPiece";
  import { objectEntries } from "../lib/utils";
  import "../style.css";
  import Coordinates from "./Coordinates.svelte";

  const chessBoardState = $state(initialPositions);
  const chessBoard = new ChessBoard(chessBoardState);
  let boardNode: HTMLElement;
</script>

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

<div>
  <!-- <pre style="background: red; z-index: 1000; position:relative">
    {JSON.stringify(chessBoard, null, 1)}
  </pre> -->
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
</style>
