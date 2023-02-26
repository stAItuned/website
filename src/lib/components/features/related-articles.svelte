<script lang="ts">
	import type { Article } from '@lib/interfaces'
	import Carousel from 'svelte-carousel'
	import RelatedArticle from './cards/related-article.svelte'
	export let relatedArticles: Article[]

	let innerWidth = 0
</script>

<svelte:window bind:innerWidth />

<!-- Title -->
<div class="my-24 px-4 max-w-4xl mx-auto">
	<h2 class="pb-12 font-bold text-2xl leading-5">Related articles:</h2>
	<!-- Related Articles  -->
	{#if innerWidth >= 768}
		<Carousel>
			{#each relatedArticles as relatedArticle}
				<div>
					<RelatedArticle {relatedArticle} />
				</div>
			{/each}
		</Carousel>
	{:else}
		<ul>
			{#each relatedArticles as relatedArticle}
				<il>
					<RelatedArticle {relatedArticle} />
				</il>
			{/each}
		</ul>
	{/if}
</div>
