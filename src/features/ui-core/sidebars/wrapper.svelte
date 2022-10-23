<script lang="ts">
	import { browser } from '$app/environment'
	import { fly } from 'svelte/transition'
	import { backInOut } from 'svelte/easing'

	export let className = ''
	export let open: boolean
	export let onClose = () => {}

	const enableScroll = () => {
		if (browser) {
			window.onscroll = () => {}
		}
	}

	const disabledScroll = () => {
		if (browser) {
			const scrollTop = window.pageYOffset || window.document.documentElement.scrollTop
			const scrollLeft = window.pageXOffset || window.document.documentElement.scrollLeft
			window.onscroll = () => {
				window.scrollTo(scrollLeft, scrollTop)
			}
		}
	}

	$: (() => {
		if (!open) {
			enableScroll()
			onClose()
		} else disabledScroll()
	})()
</script>

{#if open}
	<aside
		class={'fixed w-full h-full z-20 ' + className}
		transition:fly={{ duration: 300, easing: backInOut, x: 200 }}
	>
		<slot />
	</aside>
{/if}
