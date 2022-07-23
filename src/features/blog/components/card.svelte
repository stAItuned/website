<script lang="ts">
	import type { Article, ArticleMeta } from '@lib/notion'

	export let articleMeta: ArticleMeta
</script>

<a class="text-3xl" href="/learn/{articleMeta.slug}">
	<div
		class="flex flex-col rounded-md shadow-lg hover:cursor-pointer w-[400px] h-[400px] bg-bgLearnCard bg-no-repeat bg-[length:200%_200%] bg-center"
	>
		<div class="h-[calc(40%+100px)] mt-auto">
			<div class="h-[100px] w-[50px] rounded-bl-[50px] shadow-[0_50px_0_0_#FFF272]" />
			<div
				class="w-full h-[calc(100%-100px)] p-4 rounded-tr-[50px] bg-stayYellow-500 self-start flex flex-col gap-1 text-lg"
			>
				<p class="font-bold">
					{articleMeta.title}
				</p>
				<span class="flex gap-2">
					<p class=" font-bold">Author:</p>
					<p class="">
						{articleMeta.author}
					</p>
				</span>

				<p class="text-lg">
					{articleMeta.publishDate}
				</p>
				<p class="text-lg">5 min</p>
			</div>
		</div>
	</div>
</a>

<!-- <a class="text-3xl" href="/blog/{articleMeta.slug}">
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
</a> -->
