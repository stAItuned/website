<script lang="ts">
	// throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

	import { paginate, LightPaginationNav } from 'svelte-better-paginate' // https://github.com/kudadam/svelte-better-paginate
	import type { Article } from '@lib/interfaces'
	import type { PageData } from './$types'

	import { page } from '$app/stores'

	import { Sidebars, Cards, Button, Breadcrumb, PageTransition } from '@features/ui-core'

	import { Filters } from '@lib/configs'
	import type { Filter } from '@lib/interfaces'
	import { date } from '@lib/helpers'

	export let data: PageData

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

	const handleChange = (e: Event) => {
		const currentTarget: HTMLInputElement = e.target as HTMLInputElement
		activeFilters.searchParam = currentTarget.value.toLowerCase()
	}
</script>

<PageTransition>
	<Sidebars.Filters bind:open={open_filters} {activeFilters} {filter} />

	<section class="lg:px-8 mt-[150px] mb-16">
		<div class="px-4 mb-16 space-x-8 flex flex-row justify-end items-end lg:items-center">
			<div
				class="flex flex-col lg:flex-row w-full justify-between lg:items-center space-y-8 lg:space-y-0"
			>
				<Breadcrumb />
				<form on:submit|preventDefault={filter} class="w-full flex justify-end -space-x-16">
					<input
						on:change|preventDefault={handleChange}
						name="search"
						placeholder="Search by titles or authors..."
						type="search"
						class="bg-gray-200 py-4 px-8 w-full lg:w-1/3 rounded-full border-0 focus:ring-0"
					/>

					<Button type="submit" variant="secondary" rounded="full" className="lg:px-8 shadow">
						Search
					</Button>
				</form>
			</div>
			<svg
				on:click={() => (open_filters = !open_filters)}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-10 h-10 hover:cursor-pointer hover:scale-125 transition"
			>
				<path
					d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
				/>
			</svg>
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
