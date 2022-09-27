<script lang="ts">
	import type { Article } from '@lib/git/types'
	// export let articleMeta: ArticleMeta
	export let article: Article

	import {
		Card,
		CardTitle,
		CardSubtitle,
		CardActions,
		Button,
		Icon,
		Divider,
		MaterialApp
	} from 'svelte-materialify'
	import { slide } from 'svelte/transition'

	let active = false
	function toggle() {
		active = !active
	}

	const cleanDate = new Date(article.metadata.date).toLocaleDateString(undefined, {
		year: '2-digit',
		month: '2-digit',
		day: '2-digit'
	})
</script>

<div class="d-flex m-4 max-w-xs ">
	<Card class="w-max h-max">
		<a class="text-3xl" href="/learn/{article.slug}">
			
			<div class="bg-cover bg-center">
				<img
					src={article.metadata.cover || 'assets/general/bg-1.jpeg'}
					alt="background"
					class="h-[180px] w-full"
				/>
			</div>

			<div class="h-42">

				<div class="h-24">
				
					<p class="text-bold text-xl text-left p-4 m-0">{article.metadata.title}</p>
				
				</div>
				<!-- TOPIC 
				<div class="flex p-2 pb-0 pt-0 max-h-12">
					<div class="pl-3 pt-2">
						<img src="/assets/learn/Topic.png" alt="avatar" class="max-h-[15px]" />
					</div>
					<div class="pb-1 pl-3">
						<span><p class="flex text-lg mb-0 uppercase">{article.metadata.topics.reduce(
							(prev, curr) => `${prev}${prev === '' ? '' : ','} ${curr}`,
							''
						)}
						</p></span>
					</div>
				</div>-->

				<!-- DATE -->
				<div class="flex p-2 pt-0 pb-0 max-h-12">
					<div class="pl-3 pt-2">
						<img src="/assets/learn/Agenda.svg" alt="avatar" class="max-h-8" />
					</div>
					<div class="p-1 pl-3">
						<span><p class="flex text-lg mb-0 uppercase">{cleanDate}</p></span>
					</div>
				</div>
					
				<!-- READING TIME -->
				<div class="flex p-2 pt-0 pb-0 max-h-12">
					<div class="pl-3 pt-2">
						<img src="/assets/learn/Clock.svg" alt="avatar" class="max-h-8" />
					</div>
					<div class="p-1 pl-3">
						<span><p class="flex text-lg mb-0">{article.metadata.readingTime} min.</p></span>
					</div>
				</div>
				
			</div>
		</a>

		<hr />

		<div class="grid grid-cols-6 p-2 max-h-12">
			<div class="pr-4">
				<img src="assets/cms/team/{article.metadata.author.replaceAll(' ','-')}/propic.jpg" alt="avatar" class="max-h-8 rounded-full" />
			</div>
			<div class="p-1 col-span-4">
				<span><p class="flex text-md mb-0">{article.metadata.author}</p></span>
			</div>
			<div class="p-2">
				<span><img src="assets/learn/{article.metadata.language}.png" class="h-4 mb-0" alt="Lang" /></span>
			</div>
		</div>
	</Card>
</div>

<!-- 
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
</a> -->
