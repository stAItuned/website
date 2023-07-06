<script lang='ts'>
	import { Heading } from 'flowbite-svelte'
	import { onMount } from 'svelte'
	import api from '@lib/services'
	import type { ArticlesResponse } from '@lib/models'
	import { notify } from '@lib/hooks/index.js'
	import { getNotificationsContext } from 'svelte-notifications'

	import { ArticlesTable } from '@protected/components/articles-features'

	let loading = true
	let articles: ArticlesResponse

	const { addNotification } = getNotificationsContext()

	onMount(() => {
		api.articles.inReview.fetch()
			.then(res => articles = res)
			.catch((err) => addNotification(notify.error(err)))
			.finally(() => loading = false)
	})
</script>

<header>
	<Heading tag='h2' customSize='text-4xl font-bold'>
		In-review <span class='font-black text-blue-600'>
			articles
		</span>
	</Heading>
	<p class='my-4 text-slate-500'>
		Write, edit and publish from here. You can also see your profile and set your overview.
	</p>
</header>

{#if !loading}
		<ArticlesTable {articles} hasActions={false} />
{/if}