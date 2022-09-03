<script lang="ts">
	import type { Article } from '@lib/notion'

	// populated with data from the endpoint
	export let article: Article

	import { onMount } from 'svelte'

	let equ1 = `$$\\quad$$`

	onMount(() => {
		let script = document.createElement('script')
		script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js'
		document.head.append(script)

		script.onload = () => {
			// @ts-ignore
			MathJax = {
				tex: {
					inlineMath: [
						['$', '$'],
						['\\(', '\\)']
					]
				},
				svg: { fontCache: 'global' }
			}
		}
	})
	
	const localtime = (new Date(article.meta.publishDate)).toLocaleDateString(undefined, { year: '2-digit', month: 'long', day: 'numeric' })

	const share = async () => {
		const shareData = {
			title: article.meta.title,
			text: article.meta.description,
			url: window.location.href
		}
		try {
			await navigator.share(shareData)
		} catch (err){
		    // TODO: Alternative to navigator.share
			// i was thinking of copying the url and show a toast or a popup saying that
			// or animating the icon to a clipboard? maybe this is easier
			console.log("Share failed")
			console.log(err)
		}
	}
</script>

<article class="prose prose-xl text-sm md:text-md lg:text-lg mt-10 mb-20 px-4 mx-auto">

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

			{article.meta.author}
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
			<time datetime={article.meta.publishDate}>{localtime}</time>
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
			{article.meta.readingTime}m
		</div>
		<div class="article-metadata-item">
			<button on:click={share}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-5 h-5"
				>
					<path
						d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.52 2.52 0 0113 4.5z"
					/>
				</svg>
			</button>
		</div>
	</div>
	{@html article.parsedContent}
</article>

<style>
	.article-metadata-item {
		display: grid;
		grid-template-columns: min-content auto;
		column-gap: 0.5em;
		align-items: center;
	}
</style>
