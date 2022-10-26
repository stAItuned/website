<script lang="ts">
	// throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

	import { paginate, LightPaginationNav } from 'svelte-better-paginate' // https://github.com/kudadam/svelte-better-paginate
	import type { Article } from '@lib/interfaces'
	import type { PageData } from './$types'

	import { page } from '$app/stores'

	import { Breadcrumb, Searchbar, PageTransition, Icons } from '@components/ui-core'
	import { Sidebars, Cards } from '@components/features'

	import { Filters } from '@lib/configs'
	import type { Filter } from '@lib/interfaces'
	import { date, utils } from '@lib/helpers'

	export let data: PageData

	const pathname = $page.url.pathname

	let articles: Article[] = data.articles.filter(
		(article: Article) => article.metadata.target.toLowerCase() === $page.params.target
	)

	$: filteredArticles = date.sort.mostRecentArticleFirst(articles)

	let currentPage = 1

	const activeFilters: Filter = {
		tags: [...Filters.TAGS],
		creationDate: 'Always',
		readingTime: [...Filters.READING_TIME],
		languages: [...Filters.LANGUAGES],
		searchParam: ''
	}

	const pageSize = 2 * 5 // ideally a multiple of 5 (10?), but temporarily left at 2 for developing purposes
	$: paginatedItems = paginate(filteredArticles, pageSize, currentPage) as Article[]
	const setPage = (e: { detail: { page: number } }) => {
		currentPage = e.detail.page
	}

	const filter = () => {
		filteredArticles = articles
		filteredArticles = filteredArticles.filter((article) => {
			return (
				// Topic filter
				article.metadata.topics.some((topic) => activeFilters.tags.includes(topic as any)) &&
				// Creation Date filter
				((activeFilters.creationDate !== 'Always' &&
					((activeFilters.creationDate === 'Last month' &&
						date.isArticleCreatedLastMonth(article)) ||
						(activeFilters.creationDate === 'Last week' &&
							date.isArticleCreatedLastWeek(article)))) ||
					activeFilters.creationDate === 'Always') &&
				// Reading Time filter
				((activeFilters.readingTime.includes('Less than 5 min') &&
					article.metadata.readingTime < 5) ||
					(activeFilters.readingTime.includes('5 - 10 min') &&
						article.metadata.readingTime >= 5 &&
						article.metadata.readingTime <= 10) ||
					(activeFilters.readingTime.includes('More than 10 min') &&
						article.metadata.readingTime > 10)) &&
				// Language filter
				activeFilters.languages.includes(article.metadata.language as any) &&
				// Title and author name filter
				(article.metadata.title.toLowerCase().includes(activeFilters.searchParam) ||
					article.author?.name.toLowerCase().includes(activeFilters.searchParam))
			)
		})
		open_filters = false
	}

	let open_filters = false

	const handleInput = (e: Event) => {
		const currentTarget: HTMLInputElement = e.target as HTMLInputElement
		activeFilters.searchParam = currentTarget.value.toLowerCase()
		filter()
	}
</script>

<PageTransition>
	<Sidebars.Filters bind:open={open_filters} {activeFilters} {filter} />

	<section class="max-w-7xl mx-auto mb-32 px-8 xl:px-4 mt-[150px] space-y-16">
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
