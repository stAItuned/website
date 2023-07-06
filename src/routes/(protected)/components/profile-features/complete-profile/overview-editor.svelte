<script lang='ts'>
	import { Editor } from 'bytemd'
	import { Button } from 'flowbite-svelte'
	import { goto } from '$app/navigation'
	import { user } from '@lib/stores'
	import { getNotificationsContext } from 'svelte-notifications'
	import { get } from 'svelte/store'

	export let submit: () => void
	export let profile: any

	const { addNotification } = getNotificationsContext()
	const author = get(user)?.author

	let overview = ''

	const handleSubmit = () => {
		profile = { ...profile, details: { ...profile.details, overview } }
		submit()
	}
</script>


<span class='text-sm'>Write an overview that will be uploaded on your profile</span>
<div class='flex space-x-3 items-center'>
	<Button class='mt-3' disabled={!overview} on:click={handleSubmit}>Continue and publish</Button>
	<Button class='mt-3' color='light' on:click={submit}>Skip</Button>
</div>


<Editor class='bytemd' value={overview} on:change={(e) => (overview = e.detail.value)} />