<script lang="ts">
	// @ts-ignore
	import homeBg from '@assets/general/home_bg.webp?h=1200'

	import type { PageData } from './$types'

	import HomePageMetaTags from '@lib/seo/HomePageMetaTags.svelte'

	import { Home, Socials } from '@lib/configs'
	import type { Category } from '@lib/types'
	import type { Article, Author } from '@lib/interfaces'
	import { date } from '@lib/helpers'
	import { PageTransition } from '@components/ui-core'
	import { Cards } from '@components/features'

	export let data: PageData
	
	const recentArticles: Article[] = date.sort
		.mostRecentArticleFirst(data.articles)
		.slice(0, Home.AMOUNT_OF_ARTICLES)

	const relevantArticles = date.sort.mostRecentArticleFirst(
		Home.RELEVANT_ARTICLES_SLUG.map((slug) =>
			data.articles.find((article: Article) => article.slug === slug)
		)
			.filter((article) => article !== undefined)
			.slice(0, Home.AMOUNT_OF_ARTICLES) as Article[]
	)

	let articlesToShow: Category = 'Recent'

	const setShow = (newState: Category) => {
		articlesToShow = newState
	}

	const authorsLen = data.authors.filter((author: Author) =>
		author.team.some((t) => t === 'Writers')
	).length
	const expertArticles = data.articles.filter(
		(article: Article) => article.metadata.target === 'Expert'
	).length
	const newbieArticles = data.articles.filter(
		(article: Article) => article.metadata.target === 'Newbie'
	).length

	$: articles = articlesToShow === 'Recent' ? recentArticles : relevantArticles
</script>

<svelte:head>
	<!-- HTML Meta Tags -->
	<!-- <title>{info.siteName}</title> -->
	<!-- <meta name="description" content={info.longDescription} /> -->

	<!-- Facebook Meta Tags -->
	<!-- <meta property="og:url" content={window.location.hostname} /> -->
	<!-- <meta property="og:type" content="website" /> -->
	<!-- <meta property="og:title" content={info.siteName} /> -->
	<!-- <meta property="og:description" content={info.longDescription} /> -->
	<!-- <meta property="og:image" content={info.logoPath} /> -->

	<!-- Twitter Meta Tags -->
	<!-- <meta name="twitter:card" content="summary_large_image" /> -->
	<!-- <meta property="twitter:domain" content={info.basePath} /> -->
	<!-- <meta property="twitter:url" content={info.basePath} /> -->
	<!-- <meta name="twitter:title" content={info.siteName} /> -->
	<!-- <meta name="twitter:description" content={info.longDescription} /> -->
	<!-- <meta name="twitter:image" content={info.logoPath} /> -->
	<!-- {@html getHomeSchema()} -->
</svelte:head>

<HomePageMetaTags />

<!-- Hero -->
<PageTransition>
	<div class="relative top-0 h-screen shadow-2xl flex flex-col justify-center">
		<div class="absolute h-full w-screen bg-slate-900/20" />
		<img srcset={homeBg} alt="bg-graph" class="object-cover w-full h-full" />
		<div class="absolute right-16 md:flex flex-col space-y-8 hidden">
			{#each Socials.ICON_LINKS as social}
				<a href={social.url} target="_blank" rel="noreferrer" aria-label="{social.name} icon">
					<social.icon class="w-10 h-10" />
					<svelte:component
						this={social.icon}
						class="w-10 h-10 text-slate-200 opacity-50 hover:opacity-100 transition"
					/>
				</a>
			{/each}
		</div>
		<h1
			class="text-4xl px-8 md:px-0 md:text-6xl absolute w-full md:w-1/2 md:left-16 md:right-0 font-semibold text-slate-50"
		>
			Artificial intelligence within everyone's reach
		</h1>
		<div
			class="absolute text-center bottom-16 left-8 right-8 md:left-16 md:right-16 font-semibold text-slate-50 flex justify-between space-x-4"
		>
			<div class="space-y-2">
				<h3 class="text-4xl md:text-6xl">{data.articles.length}</h3>
				<p class="text-lg md:text-2xl">articles</p>
			</div>
			<div class="space-y-2">
				<h3 class="text-4xl md:text-6xl">{expertArticles}</h3>
				<p class="text-lg md:text-2xl">articles for experts</p>
			</div>
			<div class="space-y-2">
				<h3 class="text-4xl md:text-6xl">{newbieArticles}</h3>
				<p class="text-lg md:text-2xl">articles for newbie</p>
			</div>
			<div class="space-y-2">
				<h3 class="text-4xl md:text-6xl">{authorsLen}</h3>
				<p class="text-lg md:text-2xl">writers</p>
			</div>
		</div>
	</div>

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
	<section class="bg-white text-white py-5">
		<div class="text-center flex sm:text-xl font-bold pb-5 uppercase">
			{#each Home.CATEGORIES as category}
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
				<Cards.Home
					{article}
					color={Home.ARTICLE_CARD_COLORS[idx % Home.ARTICLE_CARD_COLORS.length]}
				/>
			{/each}
		</div>
	</section>
</PageTransition>
