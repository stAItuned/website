<script lang='ts'>
	import { goto } from '$app/navigation'

	import api from '@lib/services'
	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'

	import { Heading, P } from 'flowbite-svelte'
	import { ArticleMetadataForm } from '@protected/components/articles-features'

	const { addNotification } = getNotificationsContext()

	const handleSubmit = (values, cover) => {
		api.articles
			.create({ ...values, cover })
			.then((res) => {
				addNotification(notify.success('Your article has been created successfully'))
				goto(`/articles/draft/${res.data!.attributes.slug}/editor`)
			})
			.catch((err) => addNotification(notify.error(err)))
	}
</script>

<header>
	<Heading tag='h2' customSize='text-4xl font-extrabold'>
		Write a new <span class='font-black text-blue-500'>article</span>
	</Heading>
	<p class='my-4 text-slate-500'>
		Are you ready to write a new article? Setup main info and then you will be able to write!
	</p>
	<P class='mb-4'>
		Setup main info such as title, description, targte and topics. An article should have a unique
		slug, so choose a good title beacuse the slug will be automatically generated from it.
	</P>
	<P class='mb-4'>Remember that you can still change this information later.</P>
</header>

<ArticleMetadataForm {handleSubmit} />
