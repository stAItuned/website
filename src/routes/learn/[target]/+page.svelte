<script lang="ts">
	// throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

	import type { PageData } from './$types'
	import { page } from '$app/stores'

	import { paginate, LightPaginationNav } from 'svelte-paginate' // https://github.com/kudadam/svelte-better-paginate

	import { Filters } from '@lib/configs'
	import type { Article, Filter } from '@lib/interfaces'
	import { date, utils, articles as articlesHelper } from '@lib/helpers'
	import { Breadcrumb, Searchbar, PageTransition, Icons } from '@components/ui-core'
	import { Sidebars, Cards } from '@components/features'
	import NewbieExpertMetaTags from '@lib/seo/NewbieExpertMetaTags.svelte'

	export let data: PageData

	const pathname = $page.url.pathname

	const target: typeof Filters.TARGETS[number] = utils.toSentenceCase(
		$page.params.target
	) as typeof Filters.TARGETS[number]

	const articles: Article[] = data.articles.filter(
		(article: Article) => article.metadata.target === target
	)

	const activeFilters: Filter = {
		tags: [...Filters.TAGS],
		creationDate: 'Always',
		readingTime: [...Filters.READING_TIME],
		languages: [...Filters.LANGUAGES],
		searchParam: ''
	}

	let open_filters = false

	let currentPage = 1
	const pageSize = 2 * 5 // ideally a multiple of 5 (10?), but temporarily left at 2 for developing purposes

	const setPage = (e: { detail: { page: number } }) => {
		currentPage = e.detail.page
	}

	const filter = () => {
		filteredArticles = articles
		filteredArticles = articlesHelper
			.applyFilters(articles, activeFilters)
			.filter(
				(article) =>
					article.metadata.title.toLowerCase().includes(activeFilters.searchParam) ||
					article.author?.name.toLowerCase().includes(activeFilters.searchParam)
			)

		open_filters = false
	}

	const handleInput = (e: Event) => {
		const currentTarget: HTMLInputElement = e.target as HTMLInputElement
		activeFilters.searchParam = currentTarget.value.toLowerCase()
		filter()
	}

	$: filteredArticles = date.sort.mostRecentArticleFirst(articles)
	$: paginatedItems = paginate({items: filteredArticles, pageSize, currentPage}) as Article[]
</script>

<NewbieExpertMetaTags filteredArticles={articles} target={target} />

<PageTransition>
	<Sidebars.Filters bind:open={open_filters} {activeFilters} {filter} />

	<section class="max-w-7xl mx-auto mb-32 px-4 mt-[150px] space-y-16">
		<div class="flex flex-col md:flex-row items-center gap-8 lg:gap-16">
			<Breadcrumb tabs={utils.getTabsFromPathname(pathname)} />
			<div class="flex w-full items-center lg:space-x-16 space-x-4">
				<Searchbar {handleInput} name="searchbar" placeholder="Search by title or author..." />
				<div
					on:click={() => (open_filters = !open_filters)}
					class="transition hover:opacity-100 opacity-50 text-slate-800"
				>
					<Icons.Filter clickable class="w-8 h-8" />
				</div>
			</div>
		</div>

		{#if filteredArticles.length > 0}
			<div class="flex flex-wrap">
				{#each paginatedItems as article}
					<Cards.Post {article} />
				{/each}
			</div>
		{:else}
			<div class="h-full">
				<h1 class="text-center text-2xl font-bold text-primary-500">
					No article found with your selected criteria
				</h1>
			</div>
		{/if}

		{#if articles.length > pageSize}
			<div class="w-min my-16 mx-auto">
				<LightPaginationNav
					totalItems={articles.length}
					{pageSize}
					{currentPage}
					limit={1}
					showStepOptions={true}
					on:setPage={setPage}
				/>
			</div>
		{/if}
	</section>
</PageTransition>
