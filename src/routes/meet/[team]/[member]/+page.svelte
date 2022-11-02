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
	const emptyPageHtml =
	'<div class="toc"><hr><h2 class="ToCTitle">Table of Contents</h2><nav class="toc"><ol class="toc-level toc-level-1"></ol></nav><hr></div>'

	const hasEmptyOverview = data.component.default.render().html === emptyPageHtml
	const hasWrittenArticles = articlesWrittebByAuthor.length > 0
	let openTab: 'overview' | 'articles' = 'overview'
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
				<div
					class="tab-chooser w-full flex justify-around h-10"
					class:hidden={!hasWrittenArticles || hasEmptyOverview}
				>
					<button
						class="tab-chooser-tab border-b-2 p-2 hover:border-gray-400 hover:shadow-lg"
						class:shadow-lg={openTab === 'overview'}
						on:click={() => (openTab = 'overview')}
					>
						Overview
					</button>
					<button
						class="tab-chooser-tab border-b-2 p-2 hover:border-gray-400 hover:shadow-lg"
						class:shadow-lg={openTab === 'articles'}
						class:hidden={articlesWrittebByAuthor.length === 0}
						on:click={() => (openTab = 'articles')}
					>
						Articles
					</button>
				</div>
				<div class="pt-4">
					<div
						class:hidden={openTab !== 'articles' || !hasWrittenArticles}
						class="flex flex-col  gap-2"
					>
						{#each articlesWrittebByAuthor as article}
							<a
								target="_self"
								href="/learn/{article.metadata.target.toLowerCase()}/{article.slug}"
								class="block"
							>
								<SearchArticleCard {article} />
							</a>
						{/each}
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
