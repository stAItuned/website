<script lang="ts">
	import homeLogo from '../assets/general/home_logo_3.png'
	import bgGraph from '../assets/general/bg-graph.svg'

	import { date } from '@lib/helpers'

	import type { PageData } from './$types'
	import type { Article } from '@lib/git/types'
	import info from '@lib/info'

	import { HOME_CONFIG } from '@lib/configs'
	import type { Category } from '@lib/types'

	export let data: PageData

	const recentArticles = date.sort
		.mostRecentArticleFirst(data.articles)
		.slice(0, HOME_CONFIG.AMOUNT_OF_ARTICLES)

	const relevantArticles = HOME_CONFIG.RELEVANT_ARTICLES_SLUG.map((slug) =>
		data.articles.find((e: Article) => e.slug === slug)
	)
		.filter((a) => a !== undefined)
		.slice(0, HOME_CONFIG.AMOUNT_OF_ARTICLES) as Article[]

	let articlesToShow: Category = 'Recent'

	const setShow = (newState: typeof articlesToShow) => {
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
<section class="mb-[30px] mt-[120px]">
	<div class="relative bg-primary-500 h-[600px] shadow-2xl flex flex-col justify-center">
		<img src={bgGraph} alt="bg-graph" class="absolute object-cover w-full h-full" />
		<center class="z-10">
			<img
				class="p-5 h-auto sm:w-[100vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] 2xl:w-[40vw]"
				src={homeLogo}
				alt="logo"
			/>
		</center>
	</div>
</section>

<!-- Stats -->
<!-- <section class="bg-stayYellow-600 h-full  text-white py-4 w-full">
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
<section class="bg-stayYellow-600 text-white py-5 mb-10">
	<div class="text-center flex sm:text-xl font-bold pb-5 uppercase">
		{#each HOME_CONFIG.CATEGORIES as category}
			<div
				class="w-full text-center bg-primary-600 py-4 uppercase cursor-pointer hover:text-stayYellow-600 transition"
				class:text-stayYellow-600={articlesToShow === category}
				class:text-gray-400={articlesToShow !== category}
				on:click={() => setShow(category)}
			>
				{`${category} Articles`}
			</div>
		{/each}
	</div>
	<div class="flex flex-wrap bg-primary-600 uppercase">
		{#each articles as article, idx}
			<div
				class="relative w-full md:w-1/2 sm:text-xl font-bold"
				style="background: {HOME_CONFIG.ARTICLE_CARD_COLORS[idx]};"
			>
				<a href="/learn/{article.metadata.target}/{article.slug}">
					<img
						src={article.metadata.cover}
						class="w-full max-h-[200px] object-cover opacity-[40%]"
						alt="bg"
					/>
					<span class="absolute top-[30%] left-[10%]">{article.metadata.title}</span>
				</a>
			</div>
		{/each}
	</div>
</section>
