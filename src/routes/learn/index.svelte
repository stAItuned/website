<script lang="ts">
	import type { ArticleMeta } from '@lib/notion'
	import { BlogCard } from '@features/blog/index'
	import { Filters } from '@features/header/index'
	import { paginate, LightPaginationNav } from 'svelte-better-paginate' // https://github.com/kudadam/svelte-better-paginate

	// populated with data from the endpoint
	export let articleMetas: ArticleMeta[]
	let currentPage = 1
	let pageSize = 2 // * 5 // ideally a multiple of 5 (10?), but temporarily left at 2 for developing purposes 
	$: paginatedItems = paginate(articleMetas, pageSize, currentPage)
	const setPage = (e: { detail: { page: number } }) => {
		currentPage = e.detail.page
	}
</script>

<Filters />

<center class="mb-32">
	<div
		class="w-max sm:m-2px md:m-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5"
	>
		{#each paginatedItems as articleMeta}
			<BlogCard {articleMeta} />
		{/each}

		<!-- {#each articleMetas as articleMeta}
				<BlogCard {articleMeta} />
			{/each} -->
	</div>
	{#if articleMetas.length > pageSize}
		<div class="w-min">
			<LightPaginationNav
				totalItems={articleMetas.length}
				{pageSize}
				{currentPage}
				limit={1}
				showStepOptions={true}
				on:setPage={setPage}
			/>
		</div>
	{/if}
</center>
