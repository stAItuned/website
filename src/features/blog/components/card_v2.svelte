<script lang="ts">
	import type { Article } from '@lib/git/types'

	import defaultBg from '../../../assets/general/bg-1.jpeg'
	import newbieTag from '../../../assets/learn/star-Newbie.png'
	import expertTag from '../../../assets/learn/star-Expert.png'
	import agendaIcon from '../../../assets/learn/Agenda.svg'
	import clockIcon from '../../../assets/learn/Clock.svg'

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


<a href="/learn/{article.slug}" class="h-full w-full">
	<div class="relative h-[420px] w-full flex flex-col justify-end rounded shadow-lg">
		<img
			src={article.metadata.target === 'Newbie' ? newbieTag : expertTag}
			alt="difficulty"
			class="absolute top-10 right-5 z-10 h-3"
		/>
		<img
			src={article.metadata.cover || defaultBg}
			alt="background"
			class="h-2/3 absolute top-0 w-full rounded-bl-[45px] object-cover"
		/>
		<div class="flex flex-col justify-between h-1/2 bg-stayYellow-600 rounded-tr-[45px] p-4 z-10">
			<h1 class="font-bold text-2xl">{article.metadata.title}</h1>
			<div>
				<div class="flex space-x-2">
					<img src={agendaIcon} alt="agenda icon" class="max-h-6" />
					<p class="text-md m-0">{cleanDate}</p>
				</div>
				<div class="flex space-x-2">
					<img src={clockIcon} alt="clock icon" class="max-h-6" />
					<p class="text-md mb-0">{article.metadata.readingTime} min.</p>
				</div>
			</div>

			<div class="flex items-center justify-between">
				<div class="flex space-x-2 items-center">
					<img
						src="assets/cms/team/{article.metadata.author.replaceAll(' ', '-')}/propic.jpg"
						alt="avatar"
						class="max-h-8 rounded-full"
					/>
					<p class="text-lg mb-0">{article.metadata.author}</p>
				</div>
				<img src="assets/learn/{article.metadata.language}.png" class="h-4" alt="Lang" />
			</div>
		</div>
	</div>
</a>

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
<!-- <div class="flex p-2 pt-0 pb-0 max-h-12">
				<div class="pl-3 pt-2">
					<img src="/assets/learn/Agenda.svg" alt="avatar" class="max-h-8" />
				</div>
				<div class="p-1 pl-3">
					<span><p class="flex text-lg mb-0 uppercase">{cleanDate}</p></span>
				</div>
			</div> -->

<!-- READING TIME -->
<!-- <div class="flex p-2 pt-0 pb-0 max-h-12">
				<div class="pl-3 pt-2">
					<img src="/assets/learn/Clock.svg" alt="avatar" class="max-h-8" />
				</div>
				<div class="p-1 pl-3">
					<span><p class="flex text-lg mb-0">{article.metadata.readingTime} min.</p></span>
				</div>
			</div> -->

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
