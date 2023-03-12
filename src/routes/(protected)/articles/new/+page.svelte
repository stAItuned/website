<script lang='ts'>
	import { goto } from '$app/navigation'

	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'

	import { ArticleMetadataForm } from '../components/article-metadata'

	import api from '@lib/services'

	import Header from './header.svelte'

	const { addNotification } = getNotificationsContext()

	let cover: File | undefined = undefined

	const handleSubmit = ({ title, description, target, topics }) => {
		api.articles
			.create({
				title: title as string,
				description: description as string,
				target: target as string,
				topics: topics as string[],
				cover
			})
			.then((res) => {
				addNotification(notify.success("Your article has been created successfully"))
				goto(`/articles/draft/${res.data.attributes.slug}/editor`)
			})
			.catch((err) => addNotification(notify.error(err)))
	}
</script>

<Header />
<ArticleMetadataForm {handleSubmit} />
