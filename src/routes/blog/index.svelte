<script lang="ts">
	import type { ArticleMeta } from '@lib/notion'
	import { each } from 'svelte/internal'

	// populated with data from the endpoint
	export let articleMetas: ArticleMeta[]
</script>

<h1 class="text-5xl m-auto w-max mb-32">stAI Blog</h1>

<div class="flex gap-8 w-max m-auto">
	{#each articleMetas as articleMeta}
		<a class="text-3xl" href="/blog/{articleMeta.slug}">
			<div
				class="flex flex-col gap-4 rounded-md shadow-lg p-16 hover:bg-slate-500 hover:cursor-pointer w-[400px] h-[300px]"
			>
				<p>
					{articleMeta.title}
				</p>

				<div class="flex gap-4">
					{#each articleMeta.tags as tag}
						<p class="text-sm rounded-lg bg-blue-100 p-1">{tag}</p>
					{/each}
				</div>

				<p class="text-sm line-clamp-3">
					{articleMeta.description}
				</p>
			</div>
		</a>
	{/each}
</div>
