<script lang="ts">
	import type { PageData } from './$types'
	import { page } from '$app/stores'
	import { draw } from 'svelte/transition'
	import { sineIn } from 'svelte/easing'

	import ArticleMetaTags from '@lib/seo/ArticleMetaTags.svelte'

	import type { Article } from '@lib/interfaces'
	import { utils } from '@lib/helpers'
	import { PageTransition, Breadcrumb, Icons } from '@components/ui-core'

	export let data: PageData
	const article: Article = data.article

	const componentToRender = data.componentToRender
	const isArticleGuide: boolean =
		data.component.metadata.layout !== undefined &&
		typeof data.component.metadata.layout === 'string' &&
		data.component.metadata.layout.toLowerCase() === 'guide'

	const pathname = $page.url.pathname

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
	{#if !isArticleGuide}
		<style>
			div.toc {
				display: none;
			}
		</style>
	{/if}
</svelte:head>

<ArticleMetaTags {article} />

<PageTransition>
	<section class="relative">
		<!-- COVER IMAGE -->
		<img
			src={article.metadata.cover}
			class="w-screen h-[25rem] lg:h-[30rem] object-cover"
			alt="cover"
		/>

		<div class="lg:absolute lg:top-96 top-32 p-4">
			<Breadcrumb tabs={utils.getTabsFromPathname(pathname)} />
		</div>

		<article class="prose prose-xl max-w-4xl text-base lg:text-lg mx-auto my-8 px-4 ">
			<div class="flex justify-between mb-8">
				<!-- Author -->
				<div class="flex items-center gap-2">
					<img
						src="/cms/team/{article.metadata.author.replaceAll(' ', '-')}/propic.jpg"
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
					<Icons.Calendar class="w-6 h-6" />
					<time datetime={article.metadata.date}>{localtime}</time>
				</div>

				<!-- Reading time -->
				<div class="flex items-center space-x-2">
					<Icons.Clock class="w-6 h-6" />
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
					<button on:click={share} aria-label="Share Button">
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
			<svelte:component this={componentToRender} />
		</article>
	</section>
</PageTransition>

<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
	integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X"
	crossorigin="anonymous"
/>
