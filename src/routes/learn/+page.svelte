<script lang="ts">
	// throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

	import { BlogCard } from '@features/blog/index'
	import { Filters } from '@features/header/index'
	import { paginate, LightPaginationNav } from 'svelte-better-paginate' // https://github.com/kudadam/svelte-better-paginate
	import type { Article } from '@lib/git/types'
	import type { PageData } from '.svelte-kit/types/src/routes/learn/$types'
	export let data: PageData
	const articles: Article[] = data.articles
	// populated with data from the endpoint
	$: console.log(`Articoli: ${articles.length}`)
	let filteredArticles = articles
	let currentPage = 1
	const pageSize = 2 * 5 // ideally a multiple of 5 (10?), but temporarily left at 2 for developing purposes
	$: paginatedItems = paginate(filteredArticles, pageSize, currentPage) as Article[]
	const setPage = (e: { detail: { page: number } }) => {
		currentPage = e.detail.page
	}

	const filterArticles: (filter: (articles: Article[]) => Article[]) => void = (filter) => {
		filteredArticles = filter(articles)
		// console.log(filteredArticles.length)
	}
</script>

<Filters action={filterArticles} />

<center class="mb-32">
	<div
		class="w-max sm:m-2px md:m-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5"
	>
		{#if filteredArticles.length > 0}
			{#each paginatedItems as article}
				<BlogCard {article} />
			{/each}
		{:else}
			<p>No article found with your selected criteria</p>
		{/if}

	</div>
	{#if articles.length > pageSize}
		<div class="w-min">
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
</center>
