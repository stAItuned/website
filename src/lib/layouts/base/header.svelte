<script lang="ts">
	// @ts-ignore
	import logo from '@assets/general/logo-text.png?w=512?webp'

	import { slide } from 'svelte/transition'
	import { backInOut } from 'svelte/easing'

	import { SearchModal, Sidebars } from '@components/features'
	import { Hamburger, Nav, Icons } from '@components/ui-core'

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

	let openModal = false
</script>

{#if show}
	<SearchModal bind:isOpen={openModal} />

	<Sidebars.Header bind:open={open_header} />

	<header
		class="fixed z-20 px-16 py-6 rounded-b-[30px] bg-primary-600 w-full h-[90px]"
		transition:slide={{ duration: 300, easing: backInOut }}
	>
		<div class="flex justify-between items-end">
			<a href="/" on:click={() => (open_header = false)}>
				<img class="h-[30px] lg:h-[40px] hover:cursor-pointer" srcset={logo} alt="logo" />
			</a>

			<nav class="text-white font-semibold text-xl flex space-x-8 lg:space-x-16 items-center">
				<div class="hidden lg:block">
					<Nav />
				</div>
				<div on:click={() => (openModal = !openModal)}>
					<Icons.Search clickable class="w-6 h-6" />
				</div>
				<Hamburger className="lg:hidden text-white" bind:open={open_header} />
			</nav>
		</div>
	</header>
{/if}

<svelte:window bind:scrollY={currentY} />
