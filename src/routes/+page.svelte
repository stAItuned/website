<script lang="ts">
	import homeLogo from '../assets/general/home_logo_3.png'
	import bgGraph from '../assets/general/bg-graph.svg'

	import type { PageData } from './$types'
	import type { Article } from '@lib/git/types'
	import HomePageMetaTags from '@lib/seo/HomePageMetaTags.svelte'
	const amountOfArticles = 6
	export let data: PageData
	const recentArticles = data.articles // show only published articles
		.sort(
			(a: Article, b: Article) =>
				new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
		)
		.slice(0, amountOfArticles)
	const relevantArticlesSlug = [
		'cos-è-un-algoritmo-e-per-cosa-si-utilizza',
		'cos-è-un-computer',
		"cos'è-l-intelligenza-artificiale",
		'quando-è-nata-l-intelligenza-artificiale'
	] as const // Length must be at least ${amountOfArticles}
	const relevantArticles = relevantArticlesSlug
		.map((slug) => data.articles.find((e: Article) => e.slug === slug))
		.filter((a) => a !== undefined)
		.slice(0, amountOfArticles) as Article[]

	let articlesToShow: 'relevant' | 'recent' = 'recent'
	const setShow = (newState: typeof articlesToShow) => {
		articlesToShow = newState
	}
	$: articles = articlesToShow === 'recent' ? recentArticles : relevantArticles

	const colors = ['#ffb347', '#A7C7E7', '#47efff', '#77dd77']
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

<HomePageMetaTags/>

<section class="my-[30px]">
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

<!--
<section class="bg-stayYellow-600 h-full  text-white py-4 w-full">
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4 bg-black h-full md:text-2xl sm:text-xl font-bold">
		<div class="bg-primary-600 text-center py-4 w-auto uppercase">120 <br />reading hours</div>
		<div class="bg-primary-600 text-center py-4 w-auto uppercase">50<br />articles</div>
		<div class="bg-primary-600 text-center py-4 w-auto uppercase">15<br />topics</div>
		<div class="bg-primary-600 text-center py-4 w-auto uppercase">20<br />resources</div>
		<div class="bg-primary-600 text-center py-4 w-auto uppercase">200<br />active users</div>
		<div class="bg-primary-600 text-center py-4 w-auto uppercase">25<br />team members</div>
	</div>
</section>-->

<!-- <section class="bg-stayYellow-600 h-full  text-white pb-4">
	<div class="grid grid-cols-2 gap-4 bg-primary-600 h-[100px] uppercase">
		<div class="grid grid-cols-1 gap-4 bg-primary-600 h-[100px] w-full justify-items-center">
			<div class="text-center md:text-xl sm:text-l font-bold text-stayYellow-600 py-4">
				Recent <br /> Articles
			</div>
			{#each recentArticles as recent}
				<a href="/learn/{recent.slug}">
					<div class="w-full h-[100px] bg-primary-600 text-center align-middle">
						{recent.metadata.title}
					</div>
				</a>
			{/each}
		</div>
		<div class="grid grid-cols-1 gap-4 bg-primary-600 h-[100px] w-full justify-items-center">
			<div class="text-center md:text-xl sm:text-l font-bold text-stayYellow-600 py-4">
				Relevant <br /> Articles
			</div>
			{#each relevantArticles as relevant}
				<a href="/learn/{relevant.slug}">
					<div class="w-full h-[100px] bg-primary-600 text-center align-middle">
						{relevant.metadata.title}
					</div>
				</a>
			{/each}
		</div>
	</div>
</section> -->

<section class="bg-stayYellow-600 text-white py-5 mb-10">
	<div class="text-center grid grid-cols-2 sm:text-xl font-bold pb-5 uppercase">
		<div
			class="text-center bg-primary-600 py-4 uppercase cursor-pointer hover:text-stayYellow-600 transition"
			class:text-stayYellow-600={articlesToShow === 'recent'}
			class:text-gray-400={articlesToShow !== 'recent'}
			on:click={() => setShow('recent')}
		>
			Recent Articles
		</div>
		<div
			class="text-center bg-primary-600 py-4 uppercase cursor-pointer hover:text-stayYellow-600 transition"
			class:text-stayYellow-600={articlesToShow === 'relevant'}
			class:text-gray-400={articlesToShow !== 'relevant'}
			on:click={() => setShow('relevant')}
		>
			Relevant Articles
		</div>
	</div>
	<div class="grid md:grid-cols-2 grid-cols-1 bg-primary-600 uppercase">
		{#each articles as recent, idx}
			<div class="relative sm:text-xl font-bold" style="background: {colors[idx]};">
				<a href="/learn/{recent.slug}">
					<img
						src={recent.metadata.cover}
						class="w-full max-h-[200px] object-cover opacity-[40%]"
						alt="bg"
					/>
					<span class="absolute top-[30%] left-[10%]">{recent.metadata.title}</span>
				</a>
			</div>
		{/each}

		<!--<div class="self-center  text-center md:text-xl sm:text-l font-bold text-stayYellow-600 bg-themes max-h-[200px]">
				<img src="assets/general/bg-1.jpeg" class="w-full object-fill" alt="bg"  />
				<p class="text-left">Machine Learning Theory</p>
		</div>
		<div class="self-end  text-center md:text-xl sm:text-l font-bold text-stayYellow-600 bg-themes max-h-[200px]">
			<center>
				<img src="assets/general/bg-1.jpeg" class="w-full object-cover" alt="bg" />
				<p class="text-left">Natural Language Processing</p>
			</center>		
		</div>
		<div class="self-end  text-center md:text-xl sm:text-l font-bold text-stayYellow-600 bg-themes max-h-[200px]">
			<center>
				<img src="assets/general/bg-1.jpeg" class="w-full object-cover" alt="bg" />
				<p class="text-left">Computer Vision</p>
			</center>
		</div>
		<div class="self-end  text-center md:text-xl sm:text-l font-bold text-stayYellow-600 bg-themes max-h-[200px]">
			<center>
				<img src="assets/general/bg-1.jpeg" class="w-full object-cover" alt="bg" />
				<p class="text-left">Edge AI</p>
			</center>		
		</div>-->
	</div>
</section>
