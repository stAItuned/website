<script lang='ts'>
	import { user } from '@lib/stores'
	import { Avatar } from 'flowbite-svelte'
	import { utils } from '@lib/stores/user.js'
	import { get } from 'svelte/store'
</script>

<div class='flex items-center space-x-4 !bg-indigo-100 border border-indigo-300 p-4 rounded-xl mb-8'>
	{#if get(user).firstname && get(user).lastname}
		<Avatar class='!bg-indigo-500 !text-white font-semibold'>
			{utils.name.getInitials(get(user))}
		</Avatar>
		<h6>{utils.name.getFullname(get(user))}</h6>
	{:else}
		<h6>{get(user).email}</h6>
	{/if}
</div>