<script lang='ts'>
	import type { PageData } from './$types'
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'

	import { user } from '@lib/stores'

	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'
	import api from '@lib/services'

	export let data: PageData
	const { accessToken }: string = data

	const { addNotification } = getNotificationsContext()

	onMount(async () => {
		api.auth.connectProvider('google', accessToken)
			.then(res => {
				user.set(res)
				goto('/dashboard')
			})
			.catch(err => addNotification(notify.error(err)))
	})
</script>