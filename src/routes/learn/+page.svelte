<script lang="ts">
	// throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

	import dayjs from 'dayjs'

	import { BlogCard } from '@features/blog/index'
	import { paginate, LightPaginationNav } from 'svelte-better-paginate' // https://github.com/kudadam/svelte-better-paginate
	import type { Article } from '@lib/git/types'
	import type { PageData } from '.svelte-kit/types/src/routes/learn/$types'

	import { HamburgerFilters } from '@features/header/index'
	import SidebarFilters from '@features/header/components/sidebar_filters.svelte'

	import { Filters } from '@lib/constants'
	import type { Filter } from '@lib/interfaces'

	export let data: PageData

	let articles: Article[] = data.articles

	$: filteredArticles = articles.sort((a1, a2) => {
		if (dayjs(a1.metadata.date).isAfter(dayjs(a2.metadata.date))) return -1
		else return 1
	})
	let currentPage = 1

	const activeFilters: Filter = {
		tags: [...Filters.TAGS],
		creationDate: 'Always',
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
				article.metadata.topics.some((topic) => activeFilters.tags.includes(topic as any)) &&
				((activeFilters.creationDate !== 'Always' &&
					((activeFilters.creationDate === 'Last month' &&
						dayjs(article.metadata.date).isAfter(dayjs().subtract(1, 'month'))) ||
						(activeFilters.creationDate === 'Last week' &&
							dayjs(article.metadata.date).isAfter(dayjs().subtract(1, 'week'))))) ||
					activeFilters.creationDate === 'Always') &&
				activeFilters.languages.includes(article.metadata.language as any) &&
				(article.metadata.title.toLowerCase().includes(activeFilters.searchParam) ||
					article.author?.name.toLowerCase().includes(activeFilters.searchParam))
			)
		})
		open_filters = false
	}

	let open_filters = false

	const handleChange = (e: Event) => {
		e.preventDefault()
		const currentTarget: HTMLInputElement = e.target as HTMLInputElement
		activeFilters.searchParam = currentTarget.value.toLowerCase()
	}

	const search = (e: Event) => {
		e.preventDefault()
		filter()
	}
</script>

<section class="py-16 lg:px-8">
	<SidebarFilters bind:open_filters {activeFilters} {filter} />
	<div class="px-4 mb-16 space-x-4 flex flex-row justify-end align-center">
		<form on:submit={(e) => search(e)} class="w-full flex justify-end -space-x-16">
			<input
				on:change={(e) => handleChange(e)}
				name="search"
				placeholder="Search by titles or authors..."
				type="search"
				class="bg-gray-200 py-4 px-8 w-full lg:w-1/3 rounded-pill focus:ring-0"
			/>
			<button
				type="submit"
				class="p-3 px-4 lg:px-8 bg-stayYellow-500 disabled:bg-stayYellow-400 disabled:text-gray-400 hover:bg-stayYellow-400 active:bg-stayYellow-600 transition text-primary-500 rounded-pill shadow"
			>
				<span class="font-semibold">Search</span>
			</button>
		</form>
		<HamburgerFilters bind:open_filters />
	</div>

	{#if filteredArticles.length > 0}
		<div class="flex flex-wrap">
			{#each paginatedItems as article}
				<BlogCard {article} />
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
