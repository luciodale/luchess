<script lang="ts">
  import { onMount } from "svelte";
  import { ChessBoard } from "../lib/Chess.js";
  import {
    type TChessBoard,
    type TDragState,
    defaultDragState,
    defaultState,
  } from "../lib/constants.js";
  import { getSquareFromCursorPosition } from "../lib/ui/getSquareFromCursorPosition.js";
  import { handleDragPiece } from "../lib/ui/handleDragPiece";
  import { showHints } from "../lib/ui/handleHints.js";
  import { getEventPosition } from "../lib/ui/utils.js";
  import { objectEntries } from "../lib/utils";
  import "../style.css";
  import Coordinates from "./Coordinates.svelte";

  type Props = {
    orientation: "w" | "b";
  };

  const { orientation }: Props = $props();

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
  <div
    class="board"
    bind:this={boardNode}
    role="button"
    tabindex="0"
    onmouseup={(e) => {
      const { clientX, clientY } = getEventPosition(e);

      const clickedSquare = getSquareFromCursorPosition(
        clientX,
        clientY,
        boardNode,
        null,
        orientation,
      );

      // if clicking on the same piece, reset dragState
      if (
        clickedSquare &&
        dragState.piece &&
        dragState.square === clickedSquare &&
        dragState.piece === boardState.board[clickedSquare] &&
        dragState.secondSelect
      ) {
        dragState.piece = null;
        dragState.square = null;
        dragState.secondSelect = false;
        dragState.validMoves = [];

        return;
      }
    }}
    onmousedown={(e) => {
      const { clientX, clientY } = getEventPosition(e);

      const clickedSquare = getSquareFromCursorPosition(
        clientX,
        clientY,
        boardNode,
        null,
        orientation,
      );

      const clickedPiece = clickedSquare && boardState.board[clickedSquare];
      const sameColorClicked =
        clickedPiece && clickedPiece[0] === boardState.currentColor;
      const samePieceClicked =
        clickedPiece &&
        clickedPiece === dragState.piece &&
        clickedSquare &&
        dragState.square === clickedSquare;

      if (samePieceClicked) {
        dragState.secondSelect = true;
        return;
      }

      if (clickedPiece) {
        showHints({
          board: chessBoard.board,
          piece: clickedPiece,
          fromSquare: clickedSquare,
          dragState,
          currentColor: boardState.currentColor,
          history: boardState.history,
        });
      }

      // NOT A FIRST CLICK. HANDLE MOVES
      if (dragState.piece) {
        const validMove = dragState.validMoves.find(
          (move) => move.square === clickedSquare,
        );

        // MOVE PIECE
        if (validMove) {
          if (dragState.square && clickedSquare)
            chessBoard.setPiece(
              dragState.square,
              clickedSquare,
              dragState.piece,
            );

          dragState.piece = null;
          dragState.square = null;
          dragState.secondSelect = false;
          dragState.validMoves = [];

          return;
        }

        // if clicking on a null square, reset dragState
        if (!clickedPiece) {
          dragState.piece = null;
          dragState.square = null;
          dragState.secondSelect = false;
          dragState.validMoves = [];
          return;
        }

        // if clicking on a piece of the opposite color, set new dragState for highlighting
        // but don't show hints
        if (!sameColorClicked) {
          dragState.piece = clickedPiece;
          dragState.square = clickedSquare;
          dragState.validMoves = [];
          return;
        }
      }

      dragState.piece = clickedPiece;
      dragState.square = clickedSquare;
      dragState.secondSelect = false;
    }}
  >
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
      {#if piece}
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
              currentColor: boardState.currentColor,
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
              currentColor: boardState.currentColor,
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
