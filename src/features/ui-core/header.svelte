<script lang="ts">
	// @ts-ignore
	import logo from '../../assets/general/logo-text.svg?w=30;40?webp'

	import { slide } from 'svelte/transition'
	import { backInOut } from 'svelte/easing'

	import Hamburger from './hamburger.svelte'
	import Nav from './nav.svelte'
	import Sidebars from './sidebars'

	let currentY: number
	let prevY = 0
	let offset = 500

	let show = true

	$: (() => {
		if (currentY > prevY + offset) {
			prevY = currentY
			show = false
		} else if (currentY < prevY) {
			prevY = currentY
			show = true
		}
	})()

	export let open_header: boolean
</script>

{#if show}
	<Sidebars.Header bind:open={open_header} />

	<header
		class="fixed z-20 lg:flex  px-16 py-6 rounded-b-[30px] bg-primary-600 w-full h-[90px] justify-between items-baseline"
		transition:slide={{ duration: 300, easing: backInOut }}
	>
		<div class="flex justify-between items-center">
			<a href="/">
				<img class="h-[30px] lg:h-[40px]" srcset={logo} alt="logo" />
			</a>

			<nav class="flex z-30 lg:hidden">
				<Hamburger className="text-white" bind:open={open_header} />
			</nav>
		</div>

		<nav class="text-white font-semibold text-xl hidden lg:flex space-x-16 items-center">
			<Nav />
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-6 h-6"
			>
				<path
					fill-rule="evenodd"
					d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
					clip-rule="evenodd"
				/>
			</svg>
		</nav>
	</header>
{/if}

<svelte:window bind:scrollY={currentY} />
