<script lang='ts'>
	import type { ArticlesResponse } from '@lib/models'

	import { TableBody, TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte'
	import { ArticleRow } from '@protected/components/articles-features/articles-table'
	import { tableHeadCells } from '@protected/components/articles-features/articles-table/config'

	export let hasActions: boolean = true
	export let articles: ArticlesResponse

	let searchTerm = ''

	$: filteredArticles = articles.data!
		.filter((article) => article.attributes.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
</script>

<TableSearch placeholder='Search by title' divClass='relative overflow-x-auto shadow-none' hoverable bind:inputValue={searchTerm}>
	<caption class='p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800'>
		Our products
		<p class='mt-1 text-sm font-normal text-gray-500 dark:text-gray-400'>
			Browse a list of Flowbite products designed to help you work and play, stay organized, get
			answers, keep in touch, grow your business, and more.
		</p>
	</caption>

	<TableHead>
		{#each tableHeadCells as cell}
			<TableHeadCell>{cell}</TableHeadCell>
		{/each}
	</TableHead>
	<TableBody>
		{#each filteredArticles as article}
			<ArticleRow {article} {hasActions} />
		{/each}
	</TableBody>
</TableSearch>