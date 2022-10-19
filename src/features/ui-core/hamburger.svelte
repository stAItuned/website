<script lang="ts">
	export let open: boolean
	export let className: string
</script>

<button class={className} class:open on:click={() => (open = !open)}>
	<svg width="24" height="16">
		<line id="top" x1="0" y1="2" x2="22" y2="2" />
		<line id="middle" x1="22" y1="12" x2="6" y2="12" />
		<line id="bottom" x1="0" y1="22" x2="22" y2="22" />
	</svg>
</button>

<style>
	svg {
		min-height: 24px;
		transition: transform 0.3s ease-in-out;
	}

	svg line {
		stroke: currentColor;
		stroke-width: 3;
		transition: transform 0.3s ease-in-out;
	}

	.open svg {
		transform: scale(0.7);
		-o-transform: scale(0.7);
		-ms-transform: scale(0.7);
		-moz-transform: scale(0.7);
		-webkit-transform: scale(0.7);
	}

	.open #top {
		transform: translate(6px, 8px) rotate(45deg);
		-o-transform: translate(6px, 8px) rotate(45deg);
		-ms-transform: translate(6px, 8px) rotate(45deg);
		-moz-transform: translate(6px, 8px) rotate(45deg);
		-webkit-transform: translate(6px, 8px) rotate(45deg);
	}

	.open #middle {
		opacity: 0;
	}

	.open #bottom {
		transform: translate(-12px, 6px) rotate(-45deg);
		-o-transform: translate(-12px, 6px) rotate(-45deg);
		-ms-transform: translate(-12px, 6px) rotate(-45deg);
		-moz-transform: translate(-12px, 6px) rotate(-45deg);
		-webkit-transform: translate(-12px, 6px) rotate(-45deg);
	}
</style>
