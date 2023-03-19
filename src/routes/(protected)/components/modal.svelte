<script lang='ts'>
	import { createEventDispatcher } from 'svelte'
	import { slide } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'

	import { Button, Modal } from 'flowbite-svelte'
	import { ExclamationCircle, ExclamationTriangle } from 'svelte-heros-v2'

	type Variant = 'danger' | 'warning'

	export let size: string = "xs"
	export let open: boolean
	export let variant: Variant = 'danger'
	export let callback: () => void

	const callbackBtnColor = variant === 'danger' ? 'red' : 'yellow'
	const icon = variant === 'danger' ? ExclamationCircle : ExclamationTriangle

	const dispatch = createEventDispatcher()
</script>

<Modal
	transition={slide}
	on:hide={() => dispatch('hide')}
	params={{duration: 300, easing: quintOut}}
	bind:open
	{size}
	autoclose>
	<div class='text-center'>
		<svelte:component this={icon} class='mx-auto mb-4 w-14 h-14 text-slate-400' />
		<slot />
		<Button color={callbackBtnColor} class='mr-2' on:click={callback}>Yes, I'm sure</Button>
		<Button color='alternative'>No, cancel</Button>
	</div>
</Modal>