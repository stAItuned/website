<script lang='ts'>
	import { fly, slide } from 'svelte/transition'

	import { Dropzone, Modal } from 'flowbite-svelte'
	import { CheckCircle, CloudArrowUp } from 'svelte-heros-v2'

	import { createEventDispatcher } from 'svelte'

	import type { DropzoneProps } from './types'

	import { Label } from './utils'
	import { quintOut } from 'svelte/easing'

	interface $$Props extends DropzoneProps {
	}

	export let file: File | undefined
	const { name, id = name, accept, label = '', desc = '' }: DropzoneProps = $$props as DropzoneProps

	const dispatch = createEventDispatcher()

	let showPreview = false
</script>


{#if file}
	<Modal size='lg' bind:open={showPreview} autoclose transition={fly} params={{duration: 300, easing: quintOut}}>
		<div class='w-full h-full'>
			<img src={URL.createObjectURL(file)} alt='uploaded cover' class='object-cover'>
		</div>
	</Modal>
{/if}

<div class={`relative flex flex-col ${$$props.class}`}>
	<div class='flex items-center justify-between'>
		<Label {id} {label} />
		{#if file}
			<div transition:slide class='flex items-center text-emerald-700 text-sm'>
				<CheckCircle class='mr-1' variation='solid' size='16' />
				<span>Uploaded</span>
				<span on:click={() => showPreview = true} class='ml-2 font-semibold underline hover:cursor-pointer'>Click here to show the preview</span>
			</div>
		{/if}
	</div>
	<Dropzone {id} {accept} on:change={(e) => dispatch('upload', e)}>
		<CloudArrowUp size='64' class='text-slate-300' />
		<p class='my-2 text-sm text-slate-500'>
			<span class='font-semibold'>Click to upload</span> or drag and drop
		</p>
		<p class='text-xs text-slate-500'>{desc}</p>
	</Dropzone>
</div>
