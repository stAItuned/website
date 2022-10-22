<script lang="ts">
	// @ts-ignore
	import defaultBg from '../../../assets/general/bg-1.jpeg?w=1024?webp'
	// @ts-ignore
	import newbieTag from '../../../assets/learn/star-Newbie.png?h=64?webp'
	// @ts-ignore
	import expertTag from '../../../assets/learn/star-Expert.png?h=64?webp'
	// @ts-ignore
	import itFlag from '../../../assets/learn/Italian.png?h=64?webp'
	// @ts-ignore
	import enFlag from '../../../assets/learn/English.png?h=64?webp'

	import dayjs from 'dayjs'

	import type { Article } from '@lib/interfaces'

	export let article: Article
</script>

<div class="w-full md:w-1/2 2xl:w-1/4 p-4">
	<a href="/learn/{article.metadata.target}/{article.slug}">
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
				<div class="space-y-1">
					<div class="flex space-x-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="w-6 h-6"
						>
							<path
								d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
							/>
							<path
								fill-rule="evenodd"
								d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
								clip-rule="evenodd"
							/>
						</svg>

						<p class="text-md m-0">{dayjs(article.metadata.date).format('DD MMMM YYYY')}</p>
					</div>
					<div class="flex space-x-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="w-6 h-6"
						>
							<path
								fill-rule="evenodd"
								d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
								clip-rule="evenodd"
							/>
						</svg>

						<p class="text-md mb-0">{article.metadata.readingTime} min</p>
					</div>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex space-x-2 items-center">
						<img
							src="/assets/cms/team/{article.metadata.author.replaceAll(' ', '-')}/propic.jpg"
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
