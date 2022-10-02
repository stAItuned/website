<script lang="ts">
	import { page } from '$app/stores'
	import { CONFIG } from '@config'
	import { fly } from 'svelte/transition'
	import { backInOut } from 'svelte/easing'

	import logo from '../../../assets/general/logo-text.svg'

	$: active = $page.url.pathname

	export let open: boolean
	const close = () => (open = false)
</script>

{#if open}
	<aside
		class="fixed z-20 w-full h-full bg-primary-600 shadow-lg"
		transition:fly={{ duration: 300, easing: backInOut, x: -1000 }}
	>
		<center>
			<nav class="py-4 text-3xl text-white font-bold divide-y-2 px-10">
				<div class="mb-10">
					<a on:click={close} href="/">
						<img class="h-[40px]" src={logo} alt="logo" />
					</a>
				</div>

				<div class="flex flex-col py-8">
					{#each CONFIG.navigation.pages as page}
						<a on:click={close} href={page.path} class:text-stayYellow-500={page.path === active}>
							{page.name}
						</a>
					{/each}
				</div>
			</nav>
		</center>
	</aside>
{/if}
