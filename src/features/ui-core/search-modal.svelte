<script lang="ts">
	import { page } from '$app/stores'

	import { fly } from 'svelte/transition'

	import type { Article } from '@lib/interfaces'

	import dayjs from 'dayjs'

	import { date, scroll } from '@lib/helpers'
	import Modal from './modal'
	import CloseButton from './close-button.svelte'

	export let isOpen: boolean

	const articles: Article[] = date.sort.mostRecentArticleFirst($page.data.articles)

	let filteredArticles: Article[] = []
	let searchParam = ''

	const handleInput = (e: Event) => {
		const currentTarget: HTMLInputElement = e.target as HTMLInputElement
		searchParam = currentTarget.value
		if (searchParam)
			filteredArticles = articles.filter((article: Article) => {
				return article.metadata.title.toLowerCase().includes(searchParam.toLowerCase())
			})
		else filteredArticles = []
	}

	$: (() => {
		if (!isOpen) {
			scroll.enableScroll()
			searchParam = ''
			filteredArticles = []
		} else scroll.disabledScroll()
	})()
</script>

<Modal.Overlay bind:isOpen />

<Modal.Dialog bind:isOpen>
	<Modal.Content>
		<div class="space-y-8">
			<div class="flex items-center text-slate-500">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="w-6 h-6"
				>
					<path
						fill-rule="evenodd"
						d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
						clip-rule="evenodd"
					/>
				</svg>
				<input
					on:input|preventDefault={handleInput}
					name="search"
					placeholder="Search by titles or authors..."
					type="search"
					class="w-full rounded-lg border-0 focus:ring-0 placeholder:font-semibold placeholder:text-slate-400"
				/>
				<CloseButton bind:open={isOpen} />
			</div>
			<h1 class="text-lg font-bold text-slate-400">Articles</h1>
			<div class="space-y-4 max-h-80 overflow-y-scroll">
				{#if filteredArticles.length}
					{#each filteredArticles as article}
						<a
							transition:fly={{ duration: 300, x: 50 }}
							target="_self"
							href="/learn/{article.metadata.target.toLowerCase()}/{article.slug}"
							class="block"
						>
							<div
								class="w-full gap-4 bg-slate-50 hover:bg-sky-50 transition p-4 rounded-lg flex items-center hover:cursor-pointer"
							>
								<img
									src={article.metadata.cover}
									class="hidden lg:block h-20 w-20 object-cover rounded-lg"
									alt=""
								/>
								<div class="space-y-2 w-full">
									<div class="text-sm lg:text-lg">
										<h3 class="font-bold text-slate-700">{article.metadata.title}</h3>
										<p class="text-slate-700">{article.metadata.author}</p>
									</div>
									<p class="text-sm text-slate-400">{article.metadata.meta}</p>
									<div class="hidden lg:flex justify-between text-slate-400">
										<span>{dayjs(article.metadata.date).format('DD MMMM YYYY')}</span>
										<span>{article.metadata.readingTime} min</span>
										<span>{article.metadata.target}</span>
										<span>{article.metadata.language}</span>
									</div>
								</div>
							</div>
						</a>
					{/each}
				{:else}
					<h3 class="text-lg text-slate-400">No articles found</h3>
				{/if}
			</div>
		</div>
	</Modal.Content>
</Modal.Dialog>
