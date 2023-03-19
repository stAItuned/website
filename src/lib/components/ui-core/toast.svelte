<script lang="ts">
	import { slide } from 'svelte/transition'
	import { Toast } from 'flowbite-svelte'
	import { ExclamationCircle, CheckCircle } from 'svelte-heros-v2'

	export let notification = {}
	export let onRemove = () => {}

	const handleButtonClick = () => {
		onRemove()
	}

	const icon = notification.type === 'error' ? ExclamationCircle : CheckCircle
</script>

<div class="mr-6 shadow-lg hover:cursor-pointer" on:click={handleButtonClick}>
	<Toast
		simple
		transition={slide}
		class={`w-screen my-2 ${notification.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'} `}
	>
		<div
			class={`flex items-center ${
				notification.type === 'error' ? 'text-rose-100' : 'text-emerald-100'
			}`}
		>
			<svelte:component this={icon} class="mr-3" variation="solid" />
			<span class="mr-3 font-semibold">{notification?.text}</span>
		</div>
	</Toast>
</div>
