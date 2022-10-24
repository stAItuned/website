<script lang="ts">
	import type { Article } from '@lib/interfaces'
	import { draw } from 'svelte/transition'
	import { sineIn } from 'svelte/easing'
	import type { PageData } from './$types'
	import info from '@lib/info'

	import { PageTransition, Breadcrumb } from '@features/ui-core'

	export let data: PageData
	const article: Article = data.article

	const component = data.component

	// allows the little animation when sharing
	let shared = false

	const localtime = new Date(article.metadata.date).toLocaleDateString(undefined, {
		year: '2-digit',
		month: '2-digit',
		day: '2-digit'
	})

	const share = async () => {
		const shareData = {
			title: article.metadata.title,
			// text: article.meta.description,
			url: window.location.href
		}
		try {
			await navigator.share(shareData)
		} catch (err) {
			// console.log('navigation.share failed, fallback')
			try {
				await navigator.clipboard.writeText(window.location.href)
			} catch {
				// console.log('not even able to copy into clipboard')
				return
			}
			shared = true
			setTimeout(() => {
				shared = false
			}, 3000)
		}
	}
</script>

<svelte:head>
	<!-- <script>
		MathJax = {
			tex: {
				inlineMath: [
					['$', '$'],
					['\\(', '\\)']
				]
			},
			svg: {
				fontCache: 'global'
			}
		}
	</script>
	<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
	<script
		id="MathJax-script"
		async
		src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script> -->

	<!-- HTML Meta Tags -->
	<title>{article.metadata.title} | {info.siteName}</title>
	<meta name="description" content={article.metadata.meta} />

	<!-- Facebook Meta Tags -->
	<!-- <meta property="og:url" content={window.location.hostname} /> -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={article.metadata.title + ' | ' + info.siteName} />
	<meta property="og:description" content={article.metadata.meta} />
	<meta property="og:image" content={article.metadata.cover} />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<!-- <meta property="twitter:domain" content={window.location.hostname} />
	<meta property="twitter:url" content={window.location.host} /> -->
	<meta name="twitter:title" content={article.metadata.title + ' | ' + info.siteName} />
	<meta name="twitter:description" content={article.metadata.meta} />
	<meta name="twitter:image" content={article.metadata.cover} />
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
		integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X"
		crossorigin="anonymous"
	/>
</svelte:head>

<PageTransition>
	<section class="relative">
		<!-- COVER IMAGE -->
		<img
			src={article.metadata.cover}
			class="w-screen h-[25rem] lg:h-[30rem] object-cover"
			alt="cover"
		/>

		<div class="lg:absolute lg:top-96 top-32 p-4">
			<Breadcrumb />
		</div>
		
		<article class="prose prose-xl max-w-4xl text-base lg:text-lg mx-auto my-8 px-4 ">
			<div class="flex justify-between mb-8">
				<!-- Author -->
				<div class="flex items-center gap-2">
					<img
						src="/assets/cms/team/{article.metadata.author.replaceAll(' ', '-')}/propic.jpg"
						alt="avatar"
						class="max-h-8 rounded-full"
					/>

					{#if article.author !== undefined}
						<a
							class="no-underline hover:underline"
							href={`/meet/${article.author.team.at(0)?.toLocaleLowerCase()}`}
							>{article.author.name}</a
						>
					{:else}
						{article.metadata.author}
					{/if}
				</div>

				<!-- Date -->
				<div class="flex items-center space-x-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-6 h-6"
					>
						<path
							d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
						/>
						<path
							fill-rule="evenodd"
							d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
							clip-rule="evenodd"
						/>
					</svg>
					<time datetime={article.metadata.date}>{localtime}</time>
				</div>

				<!-- Reading time -->
				<div class="flex items-center space-x-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-6 h-6"
					>
						<path
							fill-rule="evenodd"
							d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
							clip-rule="evenodd"
						/>
					</svg>
					<p>{article.metadata.readingTime}m</p>
				</div>

				<!-- Share button -->
				{#if shared}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							in:draw={{ duration: 500, easing: sineIn }}
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
						/>
					</svg>
				{:else}
					<button on:click={share}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								in:draw={{ duration: 1000, easing: sineIn }}
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
							/>
						</svg>
					</button>
				{/if}
			</div>
			<!-- {@html article.content} -->
			<svelte:component this={component} />
		</article>
	</section>
</PageTransition>
