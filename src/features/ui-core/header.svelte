<script lang="ts">
	import logo from '../../assets/general/logo-text.svg'

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
		class="fixed z-20 lg:flex shadow-xl px-16 py-6 rounded-b-[30px] bg-primary-600 w-full h-[90px] justify-between items-baseline"
		transition:slide={{ duration: 300, easing: backInOut }}
	>
		<div class="flex justify-between items-center">
			<a href="/">
				<img class="h-[30px] lg:h-[40px]" src={logo} alt="logo" />
			</a>

			<nav class="flex z-30 lg:hidden">
				<Hamburger className="text-white z-20" bind:open={open_header} />
			</nav>
		</div>

		<nav class="text-white font-semibold text-xl hidden lg:block">
			<Nav />
		</nav>
	</header>
{/if}

<svelte:window bind:scrollY={currentY} />
