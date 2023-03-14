<script lang='ts'>
	import { page } from '$app/stores'

	import { utils } from '@lib/helpers'
	import { Breadcrumb, Icons } from '@shared/components/ui-core'
	import dayjs from 'dayjs'
	import { marked } from 'marked'

	import type { ArticleResponse } from '@lib/models'

	import { onMount } from 'svelte'
	import api from '@lib/services'
	import { SERVER_URL } from '@lib/services/config'
	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'

	const { addNotification } = getNotificationsContext()

	let loading = true
	let article: ArticleResponse

	const slug = $page.params.slug

	onMount(() => {
		api.articles.draft.fetchBySlug(slug)
			.then(res => article = res)
			.catch((err) => addNotification(notify.error(err)))
			.finally(() => loading = false)
	})

	const pathname = $page.url.pathname
</script>


{#if !loading}
	<section class='relative'>
		<!-- COVER IMAGE -->
		<img
			src={SERVER_URL + article.data.attributes.cover.data?.attributes.url}
			class='w-screen h-[25rem] lg:h-[30rem] object-cover'
			alt='cover'
		/>

		<div class='lg:absolute lg:top-96 top-32 p-4'>
			<Breadcrumb tabs={utils.getTabsFromPathname(pathname)} />
		</div>

		<article class='prose prose-xl max-w-4xl text-base lg:text-lg mx-auto my-8 px-4 '>
			<div class='flex justify-between mb-8'>
				<!-- Author -->
				<div class='flex items-center gap-2'>
					<img
						src='/cms/team/Daniele-Moltisanti/propic.jpg'
						alt='avatar'
						class='max-h-8 rounded-full'
					/>

					<p class='no-underline hover:underline'>
						{article.data.attributes.author?.data.attributes.user?.data.attributes.firstname}
					</p>
				</div>

				<!-- Date -->
				<div class='flex items-center space-x-2'>
					<Icons.Calendar class='w-6 h-6' />
					<p>{dayjs(article.data.attributes.updatedAt).format('DD MMMM YYYY')}</p>
				</div>

				<!-- Reading time -->
				<div class='flex items-center space-x-2'>
					<Icons.Clock class='w-6 h-6' />
					<p>{article.data.attributes?.readingTime}</p>
				</div>
			</div>
			{@html marked(article.data.attributes.content)}
			<!--			<svelte:component this={article.data.attributes.content} />-->
		</article>
	</section>

	<link
		rel='stylesheet'
		href='https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css'
		integrity='sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X'
		crossorigin='anonymous'
	/>
{/if}