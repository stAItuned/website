<script lang="ts">
	import { page } from '$app/stores'

	import { fly } from 'svelte/transition'

	import type { Article } from '@lib/interfaces'

	import dayjs from 'dayjs'

	import { date, scroll } from '@lib/helpers'
	import { CloseButton, Modal, Searchbar } from '../ui-core'
	import SearchArticleCard from './cards/search-article-card.svelte'

	export let isOpen: boolean

	const articles: Article[] = date.sort.mostRecentArticleFirst($page.data.articles)

	let filteredArticles: Article[] = []
	let searchParam = ''

	const handleInput = (e: Event) => {
		const currentTarget: HTMLInputElement = e.target as HTMLInputElement
		searchParam = currentTarget.value
		if (searchParam)
			filteredArticles = articles.filter((article: Article) => {
				return article.metadata.title.toLowerCase().includes(searchParam.toLowerCase()) || 
				article.author?.name.toLowerCase().includes(searchParam.toLowerCase())
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
			<div class="flex items-center text-slate-500 px-2">
				<Searchbar
					iconStart
					variant="transparent"
					name="searchbarModal"
					placeholder="Search by title or author..."
					{handleInput}
				/>
				<CloseButton bind:open={isOpen} />
			</div>
			<h1 class="text-lg font-bold text-slate-400 px-2">Articles</h1>
			<div class="space-y-4 max-h-80 overflow-y-scroll px-2">
				{#if filteredArticles.length}
					{#each filteredArticles as article}
						<a
							transition:fly={{ duration: 300, x: 50 }}
							target="_self"
							href="/learn/{article.metadata.target.toLowerCase()}/{article.slug}"
							class="block"
						>
							<SearchArticleCard {article} />
						</a>
					{/each}
				{:else}
					<h3 class="text-lg text-slate-400">No articles found</h3>
				{/if}
			</div>
		</div>
	</Modal.Content>
</Modal.Dialog>
