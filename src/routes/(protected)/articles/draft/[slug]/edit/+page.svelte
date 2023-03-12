<script lang='ts'>
	import type { PageData } from './$types'
	import { goto } from '$app/navigation'

	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'

	import { ArticleMetadataForm } from '../../../components/article-metadata'

	import api from '@lib/services'
	import type { ArticleResponse } from '@lib/models'

	// import Header from './header.svelte'

	export let data: PageData
	const { article }: { article: ArticleResponse } = data

	const initialValues = {
		title: article.data.attributes.title,
		description: article.data.attributes.description,
		target: article.data.attributes.target?.data.id.toString(),
		topics: article.data.attributes.topics?.data.map(topic => topic.id.toString())
	}

	const { addNotification } = getNotificationsContext()

	let cover: File | undefined = undefined

	const handleSubmit = ({ title, description, target, topics }) => {
		api.articles.update(article.data.id, {
			title: title as string,
			description: description as string,
			target: target as string,
			topics: topics as string[]
		})
			.then((res) => {
				addNotification(notify.success("Your article has been updated successfully"))
				goto(`/articles/draft/${res.data.attributes.slug}/editor`)
			})
			.catch((err) => addNotification(notify.error(err)))
	}
</script>

<!--<Header />-->
<ArticleMetadataForm {handleSubmit} {initialValues} />
