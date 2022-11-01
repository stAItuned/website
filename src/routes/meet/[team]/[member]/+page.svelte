<script lang="ts">
	import type { PageData } from './$types'

	import type { Author } from '@lib/interfaces'
	import { PageTransition } from '@lib/components/ui-core'
	import Breadcrumb from '@lib/components/ui-core/breadcrumb.svelte'
	import SearchArticleCard from '@lib/components/features/cards/search-article-card.svelte'
	export let data: PageData
	const author: Author = data.author
	const articlesWrittebByAuthor = data.articles.filter(
		(article) => article.metadata.author === author.name
	)
	const authorHasWrittenArticles = articlesWrittebByAuthor !== undefined
	const html = data.componentToRender.render()
	let openTab: 'overview' | 'articles'
	if ('articles' === 'articles') {
		openTab = 'articles'
	} else {
		openTab = 'overview'
	}
	// onMount(() => {
	// 	if(window.location.href.endsWith("#articles"))
	// 		openTab = "articles"
	// })
</script>

<svelte:head>
	<style>
		div.toc {
			display: none;
		}
	</style>
</svelte:head>

<PageTransition>
	<div class="max-w-7xl mx-auto mb-32 mt-[150px] space-y-16 px-8 xl:px-4">
		<div class="container">
			<div class="breadcrumbs justify-self-start md:justify-self-end">
				<Breadcrumb tabs={['Meet', author.team[0], author.name]} />
			</div>
			<div class="profile">
				<div class="profile-description text">
					{author.description}
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
			<div class="main-content">
				<ul
					class="nav nav-tabs flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0 mb-4"
					id="tabs-tab"
					role="tablist"
				>
					<li class="nav-item" role="presentation">
						<a
							href="#overview"
							class=" nav-link block font-medium text-xs leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100 focus:border-transparent active"
							id="overview-tab"
							data-bs-toggle="pill"
							data-bs-target="#overview"
							role="tab"
							aria-controls="overview"
							aria-selected="true"
							on:click={() => (openTab = 'overview')}
							on:keydown={(e) => {
								if (e.key === 'Enter') {
									openTab = 'overview'
								}
							}}
							>Overview
						</a>
					</li>
					<li class="nav-item" role="presentation">
						<a
							href="#articles"
							class="nav-link block font-medium text-xs leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100 focus:border-transparent"
							id="articles-tab"
							data-bs-toggle="pill"
							data-bs-target="#articles-tab"
							role="tab"
							aria-controls="articles-tab"
							aria-selected="false"
							on:click={() => (openTab = 'articles')}
							on:keydown={(e) => {
								if (e.key === 'Enter') {
									openTab = 'articles'
								}
							}}
							>Articles
						</a>
					</li>
				</ul>
				<div
					style:display={openTab === 'articles' ? 'flex' : 'none'}
					class="flex  flex-col gap-2"
				>
					{#if authorHasWrittenArticles}
						{#each articlesWrittebByAuthor as article}
							<a
								target="_self"
								href="/learn/{article.metadata.target.toLowerCase()}/{article.slug}"
								class="block"
							>
								<SearchArticleCard {article} />
							</a>
						{/each}
					{:else}
						<div class="text-center">
							<h1 class="text-2xl font-semibold">No articles written by {author.name} yet</h1>
						</div>
					{/if}
				</div>
				<div style:display={openTab === 'overview' ? 'flex' : 'none'} class="">
					OVERVIEW
					<svelte:component this={data.componentToRender} />
				</div>
			</div>
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
		grid-template-rows: 1fr 1fr;
		gap: 0px 0px;
		grid-auto-flow: row;
		grid-template-areas:
			'propic'
			'profile-description';
		grid-area: profile;
	}

	.profile-description {
		grid-area: profile-description;
	}

	.propic {
		grid-area: propic;
		justify-content: space-between;
	}

	.main-content {
		grid-area: main-content;
	}
</style>
