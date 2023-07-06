<script lang='ts'>
	import { User } from 'svelte-heros-v2'
	import { SERVER_URL } from '@lib/services/config'

	export let name: string | undefined
	export let preview: string | null = null
	export let file: File | undefined

	const handleChange = (e) => {
		const { files } = e.currentTarget as HTMLInputElement
		if (files?.length) file = files[0]
		else file = undefined
	}

</script>

<div class={$$props.class}>
	<div class='relative rounded-full bg-slate-100 border border-slate-200 w-48 h-48 mt-1'>
		<label class='absolute w-full h-full flex items-center justify-center hover:cursor-pointer'>
			{#if file}
				<img src={URL.createObjectURL(file)} alt='avatar' class='rounded-full object-cover h-full w-full'>
			{:else if preview}
				<img src={SERVER_URL + preview} alt='avatar' class='rounded-full object-cover h-full w-full'>
			{:else}
				<div class='flex flex-col items-center space-y-3'>
					<User size='32' class='text-slate-400 opacity-50' />
					<span class='text-sm font-semibold text-slate-400'>Click to upload</span>
				</div>
			{/if}
			<input id={name} {name} type='file' accept='image/*' class='hidden' on:change={handleChange} />
		</label>
	</div>
</div>