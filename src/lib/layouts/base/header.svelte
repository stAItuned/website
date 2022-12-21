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
		class="fixed z-20 px-8 py-6 w-full"
		transition:slide={{ duration: 300, easing: backInOut }}
	>
		<div class="flex justify-between items-start">
			<a href="/" on:click={() => (open_header = false)}>
				<img class="h-[30px] lg:h-[50px] hover:cursor-pointer" srcset={logo} alt="logo" />
			</a>

			<nav class="relative py-3 px-8 text-white rounded-full bg-primary-600 font-semibold text-xl flex space-x-0 lg:space-x-16 items-center">
				<div class="hidden lg:block mr-16">
					<Nav />
				</div>
				<div class="rounded-full bg-primary-300 absolute right-0 p-4" on:click={() => (openModal = !openModal)}>
					<Icons.Search clickable class="w-7 h-7" />
				</div>
				<Hamburger className="lg:hidden text-white pr-12" bind:open={open_header} />
			</nav>
		</div>
	</header>
{/if}

<svelte:window bind:scrollY={currentY} />
