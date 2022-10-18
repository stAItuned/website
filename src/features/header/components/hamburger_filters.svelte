<script>
	export let open_filters = false
</script>

<button
	class="flex space-x-2 p-4 bg-stayYellow-500 hover:bg-stayYellow-400 active:bg-stayYellow-600 transition rounded-pill"
	class:open_filters
	on:click={() => (open_filters = !open_filters)}
>
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

	.open_filters svg {
		transform: scale(0.7);
		-o-transform: scale(0.7);
		-ms-transform: scale(0.7);
		-moz-transform: scale(0.7);
		-webkit-transform: scale(0.7);
	}

	.open_filters #top {
		transform: translate(6px, 8px) rotate(45deg);
		-o-transform: translate(6px, 8px) rotate(45deg);
		-ms-transform: translate(6px, 8px) rotate(45deg);
		-moz-transform: translate(6px, 8px) rotate(45deg);
		-webkit-transform: translate(6px, 8px) rotate(45deg);
	}

	.open_filters #middle {
		opacity: 0;
	}

	.open_filters #bottom {
		transform: translate(-12px, 6px) rotate(-45deg);
		-o-transform: translate(-12px, 6px) rotate(-45deg);
		-ms-transform: translate(-12px, 6px) rotate(-45deg);
		-moz-transform: translate(-12px, 6px) rotate(-45deg);
		-webkit-transform: translate(-12px, 6px) rotate(-45deg);
	}
</style>
