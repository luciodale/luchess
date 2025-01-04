<script lang="ts">
    import type { TColor } from "../lib/constants";

    type Props = {
        color: TColor;
    };
    const { color }: Props = $props();

    const isWhite = color === "white";
</script>

<svg viewBox="0 0 100 100" class="coordinates">
    <text x="0.75" y="3.5" font-size="2.8" class="coordinate-light">
        {#if isWhite}8{:else}1{/if}
    </text>
    <text x="0.75" y="15.75" font-size="2.8" class="coordinate-dark">
        {#if isWhite}7{:else}2{/if}
    </text>
    <text x="0.75" y="28.25" font-size="2.8" class="coordinate-light">
        {#if isWhite}6{:else}3{/if}
    </text>
    <text x="0.75" y="40.75" font-size="2.8" class="coordinate-dark">
        {#if isWhite}5{:else}4{/if}
    </text>
    <text x="0.75" y="53.25" font-size="2.8" class="coordinate-light">
        {#if isWhite}4{:else}5{/if}
    </text>
    <text x="0.75" y="65.75" font-size="2.8" class="coordinate-dark">
        {#if isWhite}3{:else}6{/if}
    </text>
    <text x="0.75" y="78.25" font-size="2.8" class="coordinate-light">
        {#if isWhite}2{:else}7{/if}
    </text>
    <text x="0.75" y="90.75" font-size="2.8" class="coordinate-dark">
        {#if isWhite}1{:else}8{/if}
    </text>
    <text x="10" y="99" font-size="2.8" class="coordinate-dark">
        {#if isWhite}a{:else}h{/if}
    </text>
    <text x="22.5" y="99" font-size="2.8" class="coordinate-light">
        {#if isWhite}b{:else}g{/if}
    </text>
    <text x="35" y="99" font-size="2.8" class="coordinate-dark">
        {#if isWhite}c{:else}f{/if}
    </text>
    <text x="47.5" y="99" font-size="2.8" class="coordinate-light">
        {#if isWhite}d{:else}e{/if}
    </text>
    <text x="60" y="99" font-size="2.8" class="coordinate-dark">
        {#if isWhite}e{:else}d{/if}
    </text>
    <text x="72.5" y="99" font-size="2.8" class="coordinate-light">
        {#if isWhite}f{:else}c{/if}
    </text>
    <text x="85" y="99" font-size="2.8" class="coordinate-dark">
        {#if isWhite}g{:else}b{/if}
    </text>
    <text x="97.5" y="99" font-size="2.8" class="coordinate-light">
        {#if isWhite}h{:else}a{/if}
    </text>
</svg>

<style>
    .coordinate-dark {
        fill: #ebecd0;
    }

    .coordinate-light {
        fill: #739552;
    }

    .coordinates {
        font-weight: 500;
        font-family: sans-serif;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
    }
</style>
