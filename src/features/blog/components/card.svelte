<script lang="ts">
	import type { Article, ArticleMeta } from '@lib/notion'

	export let articleMeta: ArticleMeta
</script>


<a class="text-3xl" href="/learn/{articleMeta.slug}">
	<div
		class="flex flex-col rounded-md shadow-lg hover:cursor-pointer w-[400px] h-[450px] bg-bgLearnCard bg-no-repeat bg-[length:200%_200%] bg-center"
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