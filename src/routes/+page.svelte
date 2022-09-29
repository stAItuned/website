<script lang="ts">
	import type { PageData } from './$types'
	import info from '@lib/info'
	import type { Article } from '@lib/git/types'
	const amountOfArticles = 1
	export let data: PageData
	const recentArticles = data.articles // show only published articles
		.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
		.slice(0, amountOfArticles)
	const relevantArticlesSlug = [
		'cos-è-un-algoritmo-e-per-cosa-si-utilizza',
		'introduzione-e-primi-passi-sul-deep-learning',
		'time-series-forecasting-with-fraction-differentiation',
		'natural-language-processing-course'
	] as const // Length must be at least ${amountOfArticles}
	const relevantArticles = relevantArticlesSlug
		.map((slug) => data.articles.find((e) => e.slug === slug))
		.filter((a) => a !== undefined)
		.slice(0, amountOfArticles) as Article[]

	let articlesToShow: 'relevant' | 'recent' = 'recent'
	const setShow = (newState: typeof articlesToShow) => {
		articlesToShow = newState
	}
	$: articles = articlesToShow === 'recent' ? recentArticles : relevantArticles

	const colors = ['#ffb347','#A7C7E7','#47efff','#77dd77']
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

<section class="w-full py-[30px]">
	<div
		class="bg-primary-500 bg-bgGraph bg-cover bg-center w-full h-[600px] shadow-2xl grid grid-cols-1 content-center"
	>
		<center>
			<img
				class="z-1 top-[50px] left-[100px] object-contain  self-end p-5
					   sm:h-auto sm:w-[100vw] 
					   md:h-auto md:w-[90vw] 
					   lg:h-auto lg:w-[70vw] 
					   xl:h-auto xl:w-[60vw]
					   2xl:h-auto 2xl:w-[40vw]"
				src="/assets/general/home_logo.png"
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

<section class="bg-stayYellow-600 h-full  text-white mb-10">
	<div
		class="text-center grid grid-cols-2 md:text-xl sm:text-l font-bold text-primary-600 py-4 uppercase"
	>
		<div
			class="text-center md:text-xl sm:text-l font-bold bg-primary-600 p-4 uppercase cursor-pointer"
			class:text-stayYellow-600={articlesToShow === 'recent'}
			class:text-gray-400={articlesToShow !== 'recent'}
			on:click={() => setShow('recent')}
		>
			Recent Articles
		</div>
		<div
			class="text-center md:text-xl sm:text-l font-bold bg-primary-600 p-4 uppercase cursor-pointer"
			class:text-stayYellow-600={articlesToShow === 'relevant'}
			class:text-gray-400={articlesToShow !== 'relevant'}
			on:click={() => setShow('relevant')}
		>
			Relevant Articles
		</div>
	</div>
	<div class="grid md:grid-cols-2 sm:grid-cols-1 bg-primary-600 uppercase no-padding m-0">
		{#each articles as recent,idx}
			<div
				class="self-center align-middle text-center md:text-xl sm:text-l font-bold text-stayYellow-600 bg-themes max-h-[200px]"
				style="background: {colors[idx]}; overflow: hidden; height: 100%; z-index: 2; opacity: 1"
			>
				<a href="/learn/{recent.slug}">
					<img src={recent.metadata.cover} class="opacity-100 object-cover" alt="bg" style="opacity: 0.3"/>
					<p class="text-left align-middle max-w-[80%]">{recent.metadata.title}</p>
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
	<div class="bg-stayYellow-600 h-5">

	</div>
	
</section>
