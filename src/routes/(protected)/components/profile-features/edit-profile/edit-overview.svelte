<script>
	import { Editor } from 'bytemd'
	import { Button } from 'flowbite-svelte'
	import { goto } from '$app/navigation'
	import api from '@lib/services'
	import { user } from '@lib/stores'
	import { notify } from '@lib/hooks'
	import { getNotificationsContext } from 'svelte-notifications'
	import { get } from 'svelte/store'

	const { addNotification } = getNotificationsContext()
	const author = get(user)?.author

	let overview = author.overview

	const handleSubmit = () => {
		api.profile.update(author.id, { overview })
			.then(res => {
				user.set(res)
				addNotification(notify.success('Your profile has been updated successfully'))
				goto('/profile')
			})
			.catch((err) => addNotification(notify.error(err)))
	}
</script>


<Editor class='bytemd' value={overview} on:change={(e) => (overview = e.detail.value)} />
<Button class='mt-3' size='lg' disabled={!overview} on:click={handleSubmit}>Save</Button>
