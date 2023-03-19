<script lang="ts">
	// @ts-ignore
	import itFlag from '@assets/learn/Italian.png?h=64?webp'
	// @ts-ignore
	import enFlag from '@assets/learn/English.png?h=64?webp'

	import { fly } from 'svelte/transition'

	import dayjs from 'dayjs'

	import { Icons, Button } from '@shared/components/ui-core'
	import type { Article } from '@lib/interfaces'
	import { goto } from '$app/navigation'

	export let article: Article
</script>

<div
	transition:fly={{ duration: 300, y: 50 }}
	on:click={() => goto(`/learn/${article.metadata.target.toLowerCase()}/${article.slug}`)}
	class="w-full md:w-1/2 xl:w-1/3 py-4 md:p-4  text-primary-600 hover:cursor-pointer rounded-lg"
>
	<div class="relative h-[420px] flex flex-col justify-end hover:scale-105 transition duration-300 my-16">
		<img
			src={article.metadata.cover}
			alt="background"
			class="h-2/3 absolute -top-16 w-full rounded-lg object-cover"
		/>
		<!-- Post Info -->
		<div class="relative mx-4 h-2/3 justify-between bg-slate-100 rounded-lg p-4 z-10">
			<!-- Date -->
			<div
				class="absolute -top-10 left-0 w-full px-4 py-1 flex space-x-2 font-semibold text-white bg-slate-700 bg-opacity-40 rounded-lg"
			>
				<Icons.Calendar class="w-6 h-6" />
				<p class="text-md m-0">{dayjs(article.metadata.date).format('DD MMMM YYYY')}</p>
			</div>
			<!-- Main Info -->
			<div class="space-y-6 flex flex-col justify-between h-full">
				<!-- Header -->
				<div class="flex justify-between items-center">
					<!-- Author -->
					<div class="flex space-x-2 items-center">
						<img
							src={`/cms/team/${article.metadata.author.replaceAll(' ', '-')}/propic.jpg`}
							alt="avatar"
							class="max-h-8 rounded-full"
						/>
						<p class="text-lg mb-0 font-semibold">{article.metadata.author}</p>
					</div>
					<!-- Reading Time -->
					<div class="flex space-x-2">
						<p class="text-md mb-0 font-semibold">{article.metadata.readingTime} min</p>
					</div>
				</div>
				<!-- Title -->
				<div class="space-y-2">
					<h1 class="font-bold text-lg leading-5">{article.metadata.title}</h1>
					<p class="text-sm leading-4 line-clamp-3">
						{article.metadata.meta}
					</p>
				</div>

				<!-- Footer -->
				<div class="px-16">
					<Button className="py-2" width="full">Read more</Button>
				</div>
				<!-- <div class="flex items-center justify-between">
					<img
						src={article.metadata.language === 'Italian' ? itFlag : enFlag}
						class="h-4"
						alt="Lang"
					/>
				</div> -->
			</div>
		</div>
	</div>
</div>
