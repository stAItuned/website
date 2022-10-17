<script lang="ts">
	// throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

	import { BlogCard } from '@features/blog/index'
	import { paginate, LightPaginationNav } from 'svelte-better-paginate' // https://github.com/kudadam/svelte-better-paginate
	import type { Article } from '@lib/git/types'
	import type { PageData } from '.svelte-kit/types/src/routes/learn/$types'

	import { HamburgerFilters } from '@features/header/index'
	import SidebarFilters from '@features/header/components/sidebar_filters.svelte'

	export let data: PageData

	let articles: Article[] = data.articles

	// populated with data from the endpoint
	// $: console.log(`Articoli: ${articles.length}`)

	$:  filteredArticles = articles
	let currentPage = 1

	const pageSize = 2 * 5 // ideally a multiple of 5 (10?), but temporarily left at 2 for developing purposes
	$: paginatedItems = paginate(filteredArticles, pageSize, currentPage) as Article[]
	const setPage = (e: { detail: { page: number } }) => {
		currentPage = e.detail.page
	}

	// const filterArticles: (filter: (articles: Article[]) => Article[]) => void = (filter) => {
	// 	filteredArticles = filter(articles)
	// 	// console.log(filteredArticles.length)
	// }

	const search = (e: Event) => {
		e.preventDefault()
		const search: HTMLInputElement = e.target as HTMLInputElement;
		filteredArticles = filteredArticles.filter((article) =>
			article.metadata.title.includes(search.value)
		)
	}

	let open_filters = false
</script>

<section class="py-16 px-8">
	<SidebarFilters bind:open_filters bind:filteredArticles {articles} />
	<div class="px-4 mb-16 space-x-8 flex justify-end align-center ml-auto">
		<input
			on:change={(e) => search(e)}
			placeholder="Search..."
			type="search"
			class="bg-gray-200 py-4 px-8 w-full lg:w-1/3 rounded-pill"
		/>
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
