<script lang="ts">
  import { ChessBoard } from "../lib/board/ChessBoard";
  import { initialPositions } from "../lib/constants";
  import { handleDragPiece } from "../lib/ui/handleDragPiece";
  import "../style.css";
  import Coordinates from "./Coordinates.svelte";

  const chessBoard = $state(initialPositions);
  new ChessBoard(chessBoard);
</script>

<div class="board" id="board-primary">
  <Coordinates />

  <div class="element-pool"></div>
  {#each Object.entries(chessBoard) as [square, piece]}
    <button
      class={`piece ${piece} square-${square}`}
      data-square={square}
      aria-label={`${square}-${piece}`}
      ontouchstart={handleDragPiece}
      onmousedown={handleDragPiece}
    ></button>
  {/each}
</div>

<div>
  <pre style="background: red; z-index: 1000; position:relative">
    {JSON.stringify(chessBoard, null, 1)}
  </pre>
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
