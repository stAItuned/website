<script lang="ts">
	import type { Article } from '@lib/git/types'
	import { draw } from 'svelte/transition'
	import { sineIn } from 'svelte/easing'
	import type { PageData } from '.svelte-kit/types/src/routes/learn/[slug]/$types'
	import info from '@lib/info'

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
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css" integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X" crossorigin="anonymous">
</svelte:head>

<article class="prose prose-xl text-sm md:text-md lg:text-lg mt-10 mb-20 px-4 mx-auto">
	<!-- COVER IMAGE -->
	<img src={article.metadata.cover} class="w-full h-auto" alt="cover" />

	<div
		class="grid justify-items-center mb-2"
		style="column-gap: 1em; grid-template-columns: minmax(min-content, 1fr) max-content minmax(min-content, 1fr) min-content"
	>
		<div class="article-metadata-item">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
			{#if article.author !== undefined}
				<a href={`/meet/${article.author.team.at(0)}`}>{article.author.name}</a>
			{:else}
				{article.metadata.author}
			{/if}
		</div>
		<div class="article-metadata-item">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
				/>
			</svg>
			<time datetime={article.metadata.date}>{localtime}</time>
		</div>
		<div class="article-metadata-item">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			{article.metadata.readingTime}m
		</div>
		<div class="article-metadata-item">
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
	</div>
	<!-- {@html article.content} -->
	<svelte:component this={component} />
</article>

<style>
	.article-metadata-item {
		display: grid;
		grid-template-columns: min-content auto;
		column-gap: 0.5em;
		align-items: center;
	}
	:global(article > * > img) {
		margin-left: auto;
		margin-right: auto;
	}
</style>
