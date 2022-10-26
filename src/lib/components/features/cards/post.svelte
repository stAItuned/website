<script lang="ts">
	// @ts-ignore
	import newbieTag from '@assets/learn/star-Newbie.png?h=64?webp'
	// @ts-ignore
	import expertTag from '@assets/learn/star-Expert.png?h=64?webp'
	// @ts-ignore
	import itFlag from '@assets/learn/Italian.png?h=64?webp'
	// @ts-ignore
	import enFlag from '@assets/learn/English.png?h=64?webp'

	import { fly } from 'svelte/transition'

	import dayjs from 'dayjs'

	import { Icons } from '@components/ui-core'
	import type { Article } from '@lib/interfaces'

	export let article: Article
</script>

<div
	transition:fly={{ duration: 300, y: 50 }}
	class="w-full md:w-1/2 xl:w-1/3 py-4 md:p-4 hover:scale-105 transition duration-300 z-0"
>
	<a href={`/learn/${article.metadata.target.toLowerCase()}/${article.slug}`}>
		<div class="relative h-[420px] flex flex-col justify-end rounded ">
			<img
				src={article.metadata.target === 'Newbie' ? newbieTag : expertTag}
				alt="difficulty"
				class="absolute top-10 right-5 z-10 h-3"
			/>
			<img
				src={article.metadata.cover}
				alt="background"
				class="h-2/3 absolute top-0 w-full rounded-bl-[45px] object-cover"
			/>
			<div class="flex flex-col justify-between h-1/2 bg-secondary-600 rounded-tr-[45px] p-4 z-10">
				<h1 class="font-bold text-xl">{article.metadata.title}</h1>
				<div class="space-y-1">
					<div class="flex space-x-2">
						<Icons.Calendar class="w-6 h-6" />
						<p class="text-md m-0">{dayjs(article.metadata.date).format('DD MMMM YYYY')}</p>
					</div>
					<div class="flex space-x-2">
						<Icons.Clock class="w-6 h-6" />
						<p class="text-md mb-0">{article.metadata.readingTime} min</p>
					</div>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex space-x-2 items-center">
						<img
							src={`/cms/team/${article.metadata.author.replaceAll(' ', '-')}/propic.jpg`}
							alt="avatar"
							class="max-h-8 rounded-full"
						/>
						<p class="text-lg mb-0">{article.metadata.author}</p>
					</div>
					<img
						src={article.metadata.language === 'Italian' ? itFlag : enFlag}
						class="h-4"
						alt="Lang"
					/>
				</div>
			</div>
		</div>
	</a>
</div>
