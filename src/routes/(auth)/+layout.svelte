<script lang='ts'>
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { user } from '@lib/stores'

	// @ts-ignore
	import logoDark from '@assets/general/logo-text-dark.png?w=196?webp'

	onMount(() => {
		if ($user) goto('/dashboard')
	})
</script>

{#if !$user}
	<div class='min-h-screen py-8 flex flex-col justify-center overflow-x-hidden'>
		<section>
			<img
				src={logoDark}
				alt='logo'
				on:click={() => goto('/')}
				class='mx-auto mb-12 hover:cursor-pointer'
			/>
			<slot />
		</section>
	</div>
{/if}
