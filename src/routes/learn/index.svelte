<script lang="ts">
	import type { ArticleMeta } from '@lib/notion'
	import { BlogCard } from '@features/blog/index.ts'
	
	// populated with data from the endpoint
	export let articleMetas: ArticleMeta[]
</script>

<h1 class="text-5xl m-auto w-max mb-32">stAI Blog</h1>

<div class="flex items-center gap-8 w-max m-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 m-2">
	{#each articleMetas as articleMeta}
		<BlogCard {articleMeta} />
	{/each}
</div>
