<script lang="ts">
	// @ts-ignore-line
	import homeLogo from '../assets/general/home_logo_3.png?h=600?webp'
	// @ts-ignore
	import bgGraph from '../assets/general/bg-graph.svg?h=600?webp'

	import type { PageData } from './$types'

	import { fly } from 'svelte/transition'

	import info from '@lib/info'

	import type { Category } from '@lib/types'
	import type { Article } from '@lib/interfaces'
	import { HomeConfigs } from '@lib/configs'
	import { date } from '@lib/helpers'
	import { PageTransition } from '@features/ui-core'

	export let data: PageData

	const recentArticles: Article[] = date.sort
		.mostRecentArticleFirst(data.articles)
		.slice(0, HomeConfigs.AMOUNT_OF_ARTICLES)

	const relevantArticles = date.sort.mostRecentArticleFirst(
		HomeConfigs.RELEVANT_ARTICLES_SLUG.map((slug) =>
			data.articles.find((article: Article) => article.slug === slug)
		)
			.filter((article) => article !== undefined)
			.slice(0, HomeConfigs.AMOUNT_OF_ARTICLES) as Article[]
	)

	let articlesToShow: Category = 'Recent'

	const setShow = (newState: Category) => {
		articlesToShow = newState
	}

	$: articles = articlesToShow === 'Recent' ? recentArticles : relevantArticles
</script>

<svelte:head>
	<title>{info.siteName}</title>
	<!-- HTML Meta Tags -->
	<title>{info.siteName}</title>
	<meta name="description" content={info.longDescription} />

	<!-- Facebook Meta Tags -->
	<!-- <meta property="og:url" content={window.location.hostname} /> -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={info.siteName} />
	<meta property="og:description" content={info.longDescription} />
	<meta property="og:image" content={info.logoPath} />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="tptp.vercel.app" />
	<!-- <meta property="twitter:url" content={window.location.hostname} /> -->
	<meta name="twitter:title" content={info.siteName} />
	<meta name="twitter:description" content={info.longDescription} />
	<meta name="twitter:image" content={info.logoPath} />
</svelte:head>

<!-- Hero -->
<PageTransition>
	<section class="mb-[30px] mt-[120px]">
		<div class="relative bg-primary-500 h-[600px] shadow-2xl flex flex-col justify-center">
			<img src={bgGraph} alt="bg-graph" class="absolute object-cover w-full h-full" />
			<center class="z-10">
				<img
					class="p-5 h-auto sm:w-[100vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] 2xl:w-[40vw]"
					srcset={homeLogo}
					alt="logo"
				/>
			</center>
		</div>
	</section>

	<!-- Stats -->
	<!-- <section class="bg-secondary-600 h-full  text-white py-4 w-full">
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4 bg-black h-full md:text-2xl sm:text-xl font-bold">
			<div class="bg-primary-600 text-center py-4 w-auto uppercase">120 <br />reading hours</div>
			<div class="bg-primary-600 text-center py-4 w-auto uppercase">50<br />articles</div>
			<div class="bg-primary-600 text-center py-4 w-auto uppercase">15<br />topics</div>
			<div class="bg-primary-600 text-center py-4 w-auto uppercase">20<br />resources</div>
			<div class="bg-primary-600 text-center py-4 w-auto uppercase">200<br />active users</div>
			<div class="bg-primary-600 text-center py-4 w-auto uppercase">25<br />team members</div>
		</div>
	</section> -->

	<!-- Home Articles Cards -->
	<section class="bg-secondary-600 text-white py-5 mb-10">
		<div class="text-center flex sm:text-xl font-bold pb-5 uppercase">
			{#each HomeConfigs.CATEGORIES as category}
				<div
					class="w-full text-center bg-primary-600 py-4 uppercase cursor-pointer hover:text-secondary-600 transition"
					class:text-secondary-600={articlesToShow === category}
					class:text-gray-400={articlesToShow !== category}
					on:click={() => setShow(category)}
				>
					{`${category} Articles`}
				</div>
			{/each}
		</div>
		<div class="flex flex-wrap bg-primary-600 uppercase transition">
			{#each articles as article, idx}
				<div
					transition:fly={{ duration: 300 }}
					class="relative w-full md:w-1/2 sm:text-xl font-bold"
					style="background: {HomeConfigs.ARTICLE_CARD_COLORS[
						idx % HomeConfigs.ARTICLE_CARD_COLORS.length
					]};"
				>
					<a href="/learn/{article.metadata.target}/{article.slug}">
						<img
							srcset={article.metadata.cover}
							class="w-full max-h-[200px] object-cover opacity-[40%]"
							alt="bg"
						/>
						<span class="absolute top-[30%] left-[10%]">{article.metadata.title}</span>
					</a>
				</div>
			{/each}
		</div>
	</section>
</PageTransition>
