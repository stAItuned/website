<script lang="ts">
	import { Dropzone } from 'flowbite-svelte'
	import { CloudArrowUp } from 'svelte-heros-v2'

	import { createEventDispatcher } from 'svelte'

	import type { DropzoneProps } from './types'

	interface $$Props extends DropzoneProps {}

	const {
		name,
		id = name,
		accept,
		label = '',
		desc = ''
	}: DropzoneProps = $$props as DropzoneProps

	const dispatch = createEventDispatcher()
</script>

<div class={`flex flex-col space-y-2 ${$$props.class}`}>
	<label for={id}>{label}</label>
	<Dropzone {id} {accept} on:change={(e) => dispatch('upload', e)}>
		<CloudArrowUp size="64" class="text-slate-300" />
		<p class="my-2 text-sm text-slate-500">
			<span class="font-semibold">Click to upload</span> or drag and drop
		</p>
		<p class="text-xs text-slate-500">{desc}</p>
	</Dropzone>
</div>
