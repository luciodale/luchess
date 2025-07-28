<script lang="ts">
import { onMount } from "svelte";

type Props = {
	active: boolean;
};

const { active }: Props = $props();

let confettiContainer: HTMLElement;

// Generate random confetti pieces
function createConfettiPiece() {
	const colors = [
		"#ff0000",
		"#00ff00",
		"#0000ff",
		"#ffff00",
		"#ff00ff",
		"#00ffff",
		"#ff8800",
		"#8800ff",
	];
	const color = colors[Math.floor(Math.random() * colors.length)];
	const left = Math.random() * 100;
	const animationDuration = 3 + Math.random() * 4; // 3-7 seconds
	const animationDelay = Math.random() * 2; // 0-2 seconds delay

	return {
		color,
		left: `${left}%`,
		animationDuration: `${animationDuration}s`,
		animationDelay: `${animationDelay}s`,
	};
}

// Generate 100 confetti pieces
const confettiPieces = Array.from({ length: 100 }, createConfettiPiece);
</script>

{#if active}
  <div class="confetti-overlay" bind:this={confettiContainer}>
    {#each confettiPieces as piece, i}
      <div 
        class="confetti-piece"
        style="
          background-color: {piece.color};
          left: {piece.left};
          animation-duration: {piece.animationDuration};
          animation-delay: {piece.animationDelay};
        "
      ></div>
    {/each}
  </div>
{/if}

<style>
  .confetti-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
    overflow: hidden;
  }

  .confetti-piece {
    position: absolute;
    width: 10px;
    height: 10px;
    top: -10px;
    animation: fall linear infinite;
    border-radius: 2px;
  }

  @keyframes fall {
    0% {
      transform: translateY(-10px) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
</style> 