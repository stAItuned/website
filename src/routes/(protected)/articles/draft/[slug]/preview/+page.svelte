<script lang='ts'>
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	import type { ArticleResponse } from '@lib/models'
	import { utils } from '@lib/helpers'
	import { Breadcrumb, Icons } from '@components/ui-core'
	import dayjs from 'dayjs'

	export let data: PageData
	const { article, content }: { article: ArticleResponse, content: string } = data

	const pathname = $page.url.pathname

	const localtime = dayjs(article.data.attributes.updatedAt).format('DD MMMM YYYY')
</script>


<section class='relative'>
	<!-- COVER IMAGE -->
	<!--	<img-->
	<!--		src={article.metadata.cover}-->
	<!--		class='w-screen h-[25rem] lg:h-[30rem] object-cover'-->
	<!--		alt='cover'-->
	<!--	/>-->

	<div class='lg:absolute lg:top-96 top-32 p-4'>
		<Breadcrumb tabs={utils.getTabsFromPathname(pathname)} />
	</div>

	<article class='prose prose-xl max-w-4xl text-base lg:text-lg mx-auto my-8 px-4 '>
		<div class='flex justify-between mb-8'>
			<!-- Author -->
			<div class='flex items-center gap-2'>
				<!--				<img-->
				<!--					src="/cms/team/{article.metadata.author.replaceAll(' ', '-')}/propic.jpg"-->
				<!--					alt='avatar'-->
				<!--					class='max-h-8 rounded-full'-->
				<!--				/>-->


				<!--				<p class='no-underline hover:underline'>-->
				<!--					{article.data.attributes.author.data.attributes.user.data.attributes.firstname}-->
				<!--				</p>-->
			</div>

			<!-- Date -->
			<div class='flex items-center space-x-2'>
				<Icons.Calendar class='w-6 h-6' />
				<p>{localtime}</p>
			</div>

			<!-- Reading time -->
			<!--			<div class='flex items-center space-x-2'>-->
			<!--				<Icons.Clock class='w-6 h-6' />-->
			<!--				<p>{article.metadata.readingTime}m</p>-->
			<!--			</div>-->
		</div>
		{@html content}
		<!--			<svelte:component this={article.data.attributes.content} />-->
	</article>
</section>

<link
	rel='stylesheet'
	href='https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css'
	integrity='sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X'
	crossorigin='anonymous'
/>
