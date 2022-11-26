<script lang="ts">
	import type { PageData } from './$types'

	import type { Article, Author } from '@lib/interfaces'
	import { PageTransition } from '@lib/components/ui-core'
	import Breadcrumb from '@lib/components/ui-core/breadcrumb.svelte'
	import SearchArticleCard from '@lib/components/features/cards/search-article-card.svelte'
	import { paginate, LightPaginationNav } from 'svelte-paginate'

	export let data: PageData
	const author: Author = data.author
	const articlesWrittebByAuthor = data.articles.filter(
		(article) => article.metadata.author === author.name
	)

	// Pagination
	const pageSize = 5;
	let currentPage = 1;
	const setPage = (e: { detail: { page: number } }) => {
		currentPage = e.detail.page
	}
	$: paginatedItems = paginate({
		items: articlesWrittebByAuthor,
		pageSize,
		currentPage
	}) as Article[]

	/**
	 * Ugly way to understand if the author has written a custom overview page
	 */
	const emptyPageHtml =
		'<div class="toc"><hr><h2 class="ToCTitle">Table of Contents</h2><nav class="toc"><ol class="toc-level toc-level-1"></ol></nav><hr></div>'

	const hasEmptyOverview = author.html === emptyPageHtml
	const hasWrittenArticles = articlesWrittebByAuthor.length > 0
	let openTab: 'overview' | 'articles' = hasEmptyOverview ? 'articles' : 'overview'
	const tabActiveClass = {
		tab: 'text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500',
		svg: 'text-blue-600 dark:text-blue-500'
	} as const
</script>

<svelte:head>
	<style>
		div.toc {
			display: none;
		}
	</style>
</svelte:head>

<PageTransition>
	<div class="max-w-7xl mx-auto mb-32 mt-[150px] space-y-16 px-8 xl:px-4 container w-full">
		<div class="breadcrumbs justify-self-start md:justify-self-end">
			<Breadcrumb tabs={['Meet', author.team[0], author.name]} />
		</div>
		<div class="profile">
			<div class="profile-description text">
				{#if !hasEmptyOverview || hasWrittenArticles}
					<!-- If Member has no overview or no articles, show description in main-content -->
					<!-- Otherwise, show it in the profile section -->
					{author.description}
				{/if}
			</div>
			<div class="propic flex flex-row md:flex-col gap-2 mb-3 items-center text-center">
				<img
					src={author.propic}
					alt="{author.name} propic"
					class="max-h-[200px] rounded-full object-cover"
				/>
				<div>
					<h1 class="text-3xl font-semibold ">
						{author.name}
					</h1>
					<h2 class="text-xl font-medium text-gray-700">
						{author.title}
					</h2>
				</div>
			</div>
		</div>
		<div class="main-content w-full">
			{#if hasEmptyOverview && !hasWrittenArticles}
				<p>
					{author.description}
				</p>
			{:else}
				<div class="border-b border-gray-200 dark:border-gray-700">
					<ul
						class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400 justify-center"
					>
						<li class="mr-2">
							<button
								on:click={() => (openTab = 'overview')}
								aria-selected={openTab === 'overview'}
								class="inline-flex p-4 rounded-t-lg border-b-2  group {openTab === 'overview'
									? tabActiveClass.tab
									: 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}"
							>
								<svg
									aria-hidden="true"
									class="mr-2 w-5 h-5 {openTab === 'overview'
										? tabActiveClass.svg
										: 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'}"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
									><path
										fill-rule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
										clip-rule="evenodd"
									/></svg
								>Overview
							</button>
						</li>
						<li class="mr-2">
							<button
								href="#"
								class="inline-flex p-4 rounded-t-lg border-b-2  group {openTab === 'articles'
									? tabActiveClass.tab
									: 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}"
								on:click={() => (openTab = 'articles')}
								aria-selected={openTab === 'articles'}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
									class="mr-2 w-5 h-5 {openTab === 'articles'
										? tabActiveClass.svg
										: 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'}"
								>
									<path
										d="M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z"
									/>
								</svg>

								Articles
							</button>
						</li>
					</ul>
				</div>

				<div class="pt-4">
					<div
						class:hidden={openTab !== 'articles' || !hasWrittenArticles}
						class="flex flex-col  gap-2"
					>
						{#each paginatedItems as article}
							<a
								target="_self"
								href="/learn/{article.metadata.target.toLowerCase()}/{article.slug}"
								class="block"
							>
								<SearchArticleCard {article} />
							</a>
						{/each}
						{#if articlesWrittebByAuthor.length > pageSize}
							<div class="w-min my-16 mx-auto">
								<LightPaginationNav
									totalItems={articlesWrittebByAuthor.length}
									{pageSize}
									{currentPage}
									limit={1}
									showStepOptions={true}
									on:setPage={setPage}
								/>
							</div>
						{/if}
					</div>
					<div class:hidden={openTab !== 'overview' || hasEmptyOverview}>
						<svelte:component this={data.component.default} />
					</div>
				</div>
			{/if}
		</div>
	</div>
</PageTransition>

<style>
	.container {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: min-content auto 1fr;
		gap: 1em 1em;
		grid-auto-flow: row;
		justify-items: center;
		grid-template-areas:
			'breadcrumbs'
			'profile'
			'main-content';
	}

	@media only screen and (min-width: 768px) {
		.container {
			grid-template-columns: 1fr 3fr;
			grid-template-rows: min-content 1fr;
			gap: 1em 1em;
			grid-template-areas:
				'profile breadcrumbs'
				'profile main-content';
		}
	}

	.breadcrumbs {
		grid-area: breadcrumbs;
	}

	.profile {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: min-content min-content;
		gap: 0px 0px;
		grid-auto-flow: row;
		grid-template-areas:
			'propic'
			'profile-description';
		grid-area: profile;
		align-items: start;
	}

	.profile-description {
		grid-area: profile-description;
	}

	.propic {
		grid-area: propic;
		justify-content: space-around;
	}

	.main-content {
		grid-area: main-content;
	}
</style>
