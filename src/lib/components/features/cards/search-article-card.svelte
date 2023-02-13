<script lang="ts">
	import type { Article } from '@lib/interfaces'
	import dayjs from 'dayjs'

	export let article: Article
</script>

<div
	class="w-full gap-4 bg-slate-50 hover:bg-sky-50 transition p-4 rounded-lg flex items-center hover:cursor-pointer"
>
	<img
		src={article.metadata.cover}
		class="hidden lg:block h-20 w-20 object-cover rounded-lg"
		alt=""
	/>
	<div class="space-y-2 w-full">
		<div class="text-sm lg:text-lg">
			<h3 class="font-bold text-slate-700">{article.metadata.title}</h3>
			<p class="text-slate-700">{article.metadata.author}</p>
		</div>
		<p class="text-sm text-slate-400 line-clamp-3">{article.metadata.meta}</p>
		<div class="hidden lg:flex justify-between text-slate-400">
			<span>{dayjs(article.metadata.date).format('DD MMMM YYYY')}</span>
			<span>{article.metadata.readingTime} min</span>
			<span>{article.metadata.target}</span>
			<span>{article.metadata.language}</span>
		</div>
	</div>
</div>
