<script lang="ts">
	import defaultBg from '../../../assets/general/bg-1.jpeg'
	import newbieTag from '../../../assets/learn/star-Newbie.png'
	import expertTag from '../../../assets/learn/star-Expert.png'
	import agendaIcon from '../../../assets/learn/Agenda.svg'
	import clockIcon from '../../../assets/learn/Clock.svg'

	import dayjs from 'dayjs'

	import type { Article } from '@lib/git/types'

	export let article: Article
</script>

<div class="w-full md:w-1/2 2xl:w-1/4 p-4">
	<a href="/learn/{article.slug}">
		<div class="relative h-[420px] flex flex-col justify-end rounded shadow-lg">
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
				<h1 class="font-bold text-xl">{article.metadata.title}</h1>
				<div>
					<div class="flex space-x-2">
						<img src={agendaIcon} alt="agenda icon" class="max-h-6" />
						<p class="text-md m-0">{dayjs(article.metadata.date).format('DD MMMM YYYY')}</p>
					</div>
					<div class="flex space-x-2">
						<img src={clockIcon} alt="clock icon" class="max-h-6" />
						<p class="text-md mb-0">{article.metadata.readingTime} min</p>
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
</div>
