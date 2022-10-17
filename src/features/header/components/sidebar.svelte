<script lang="ts">
	import { fly } from 'svelte/transition'
	import { backInOut } from 'svelte/easing'
	import Menu from './menu.svelte'

	import logo from '../../../assets/general/logo-text.svg'

	export let open: boolean
	const close = () => (open = false)
</script>

{#if open}
	<aside
		class="fixed z-30 w-full h-full bg-primary-600 lg:hidden"
		transition:fly={{ duration: 300, easing: backInOut, x: -1000 }}
	>
		<center>
			<nav class="py-4 text-3xl text-white font-bold divide-y-2 px-10">
				<div class="mb-10">
					<a on:click={close} href="/">
						<img class="h-[40px]" src={logo} alt="logo" />
					</a>
				</div>

				<Menu onClick={close} />
			</nav>
		</center>
	</aside>
{/if}
