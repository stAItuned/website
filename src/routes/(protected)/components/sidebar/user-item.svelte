<script lang='ts'>
	import { user } from '@lib/stores'
	import { Avatar } from 'flowbite-svelte'
	import { utils } from '@lib/stores/user.js'
	import { get } from 'svelte/store'
	import { SERVER_URL } from '@lib/services/config'
	import { User } from 'svelte-heros-v2'
</script>

<div class='flex items-center space-x-4 !bg-indigo-100 border border-indigo-300 p-4 rounded-xl mb-8'>
	{#if $user.author.avatar}
		<Avatar src={SERVER_URL + $user.author.avatar.url} />
		<h6>{utils.name.getFullname(get(user))}</h6>
	{:else if $user.author.unlocked}
		<Avatar class='!bg-indigo-500 !text-white font-semibold'>
			{utils.name.getInitials(get(user))}
		</Avatar>
		<h6>{utils.name.getFullname(get(user))}</h6>
	{:else}
		<Avatar class='!bg-indigo-500 !text-white font-semibold'>
			<User variation='solid' class='w-5 h-5 text-indigo-100' />
		</Avatar>
		<h6>{get(user).email}</h6>
	{/if}
</div>