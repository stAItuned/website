<script lang="ts">
	import type { ArticleMeta } from '@lib/notion'
	import { BlogCard } from '@features/blog/index.ts'
	
	// populated with data from the endpoint
	export let articleMetas: ArticleMeta[]

	
</script>

	<h1 class="text-5xl m-auto w-max mb-32">stAI Blog</h1>

	<center class="mb-32">
		<div class="flex w-max sm:m-2px md:m-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
		
			{#each articleMetas as articleMeta}
				<BlogCard {articleMeta} />
			{/each}

			{#each articleMetas as articleMeta}
				<BlogCard {articleMeta} />
			{/each}

		</div>
	</center>