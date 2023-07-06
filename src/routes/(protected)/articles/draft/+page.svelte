<script lang='ts'>
	import { onDestroy, onMount } from 'svelte'

	import api from '@lib/services'
	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'

	import type { ArticlesResponse } from '@lib/models'

	import { Heading, ListPlaceholder, P } from 'flowbite-svelte'
	import { ArticlesTable } from '@protected/components/articles-features'
	import { isLoadingNeeded } from '@protected/components/articles-features/articles-table/config'

	const { addNotification } = getNotificationsContext()

	let articles: ArticlesResponse

	const loadArticles = () => {
		api.articles.draft.fetch()
			.then(res => articles = res)
			.catch(err => addNotification(notify.error(err)))
			.finally(() => $isLoadingNeeded = false)
	}

	onMount(() => $isLoadingNeeded = true)

	const unsubscribe = isLoadingNeeded.subscribe((needLoad) => {
		if (needLoad) setTimeout(loadArticles, 500)
	})

	onDestroy(() => unsubscribe())
</script>

<header>
	<Heading tag='h2' customSize='text-4xl font-extrabold'>
		Draft <span class='font-black text-blue-600'>articles</span>
	</Heading>
	<p class='my-4 text-slate-500'>
		Are you ready to write a new article? Setup main info and then you will be able to write!
	</p>
	<P class='mb-4'>
		Setup main info such as title, description, target and topics. An article should have a unique
		slug, so choose a good title because the slug will be automatically generated from it.
	</P>
</header>

{#if !$isLoadingNeeded}
	{#if articles?.data.length}
		<ArticlesTable {articles} />
	{:else}
		<div>
			<h3 class='text-slate-400 mb-1.5'>Sorry, you have not created any articles yet...</h3>
			<a href='/articles/new' class='underline font-semibold text-blue-500'>Write a new article</a>
		</div>
	{/if}
{:else}
	<ListPlaceholder class='!max-w-full !shadow-none !border-0' />
{/if}