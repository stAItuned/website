<script lang='ts'>
	import { goto } from '$app/navigation'

	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'

	import { ArticleMetadataForm } from '@protected/components/article-metadata'

	import api from '@lib/services'
	import type { ArticleResponse } from '@lib/models'

	// import Header from './header.svelte'

	import { page } from '$app/stores'
	import { onMount } from 'svelte'

	const { addNotification } = getNotificationsContext()

	let loading = true
	let article: ArticleResponse
	let initialValues

	const slug = $page.params.slug

	onMount(() => {
		api.articles.draft.fetchBySlug(slug)
			.then(res => {
				article = res
				console.log(res)
				initialValues = {
					title: article.data.attributes.title,
					description: article.data.attributes.description,
					target: article.data.attributes.target?.data.id.toString(),
					topics: article.data.attributes.topics?.data.map(topic => topic.id.toString())
				}
			})
			.catch((err) => addNotification(notify.error(err)))
			.finally(() => loading = false)
	})


	let cover: File | undefined = undefined

	const handleSubmit = ({ title, description, target, topics }) => {
		api.articles.update(article.data.id, {
			title: title as string,
			description: description as string,
			target: target as string,
			topics: topics as string[]
		})
			.then((res) => {
				addNotification(notify.success('Your article has been updated successfully'))
				goto(`/articles/draft/${res.data.attributes.slug}/editor`)
			})
			.catch((err) => addNotification(notify.error(err)))
	}
</script>

{#if !loading}
	<!--<Header />-->
	<ArticleMetadataForm {handleSubmit} {initialValues} />
{/if}