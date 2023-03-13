<script lang='ts'>
	import '../styles/tailwind.css'
	import 'bytemd/dist/index.css'
	import 'github-markdown-css/github-markdown-light.css'

	import Notifications from 'svelte-notifications'
	import { Toast } from '@shared/components/ui-core'

	import { onMount } from 'svelte'
	import user from '@lib/stores/user'

	import api from '@lib/services'
	import { SyncLoader } from 'svelte-loading-spinners'
	import colors from 'tailwindcss/colors.js'

	let loading = true

	onMount(async () => {
		// Check if 'token' exists in localStorage
		if (!localStorage.getItem('token')) {
			loading = false
			return
		}

		api.auth.me()
			.then((res) => user.set(res))
			.catch(() => user.set(null))
			.finally(() => loading = false)
	})
</script>

{#if !loading}
	<Notifications item={Toast} zIndex={999}>
		<slot />
	</Notifications>
{:else}
	<div class='absolute top-[50%] left-[50%]'>
		<SyncLoader color={colors.slate['300']} />
	</div>
{/if}
