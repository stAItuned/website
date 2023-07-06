<script lang='ts'>
	import { Button, ButtonGroup, Heading } from 'flowbite-svelte'
	import { ListBullet, Squares2x2 } from 'svelte-heros-v2'
	import { onMount } from 'svelte'
	import api from '@lib/services'
	import type { ArticlesResponse } from '@lib/models'
	import { notify } from '@lib/hooks'
	import { getNotificationsContext } from 'svelte-notifications'

	import { ArticlesTable } from '@protected/components/articles-features'

	let loading = true
	let articles: ArticlesResponse

	const { addNotification } = getNotificationsContext()

	onMount(() => {
		api.articles.published.fetch()
			.then(res => articles = res)
			.catch((err) => addNotification(notify.error(err)))
			.finally(() => loading = false)
	})
</script>

<header>
	<Heading tag='h2' customSize='text-4xl font-bold'>
		Published <span class='font-black text-blue-600'>
			articles
		</span>
	</Heading>
	<p class='my-4 text-slate-500'>
		Write, edit and publish from here. You can also see your profile and set your overview.
	</p>
</header>

{#if !loading}
	<div class='px-5'>
		<ButtonGroup>
			<Button>
				<Squares2x2 class='w-5 h-5' />
			</Button>
			<Button>
				<ListBullet class='w-5 h-5' />
			</Button>
		</ButtonGroup>
	</div>
	<ArticlesTable {articles} hasActions={false} />
{/if}