<script lang="ts">
	// throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

	import dayjs from 'dayjs'

	import { paginate, LightPaginationNav } from 'svelte-better-paginate' // https://github.com/kudadam/svelte-better-paginate
	import type { Article } from '@lib/git/types'
	import type { PageData } from '.svelte-kit/types/src/routes/learn/$types'

	import { Sidebars, Cards, Hamburger, Button } from '@features/ui-core'

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
						dayjs(article.metadata.date).isAfter(dayjs().subtract(1, 'month'))) ||
						(activeFilters.creationDate === 'Last week' &&
							dayjs(article.metadata.date).isAfter(dayjs().subtract(1, 'week'))))) ||
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

<Sidebars.Filters bind:open={open_filters} {activeFilters} {filter} />

<section class="lg:px-8 mt-[150px]">
	<div class="px-4 mb-16 space-x-4 flex flex-row justify-end align-center">
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
		<Hamburger
			className="p-4 bg-stayYellow-600 hover:bg-stayYellow-500 active:bg-stayYellow-600 transition rounded-full"
			bind:open={open_filters}
		/>
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
