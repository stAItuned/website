<script lang="ts">
	import { fly } from 'svelte/transition'

	import type { Article } from '@lib/interfaces'

	export let article: Article
	export let color: string
</script>

<div
	transition:fly={{ duration: 300 }}
	class="relative w-full md:w-1/2 sm:text-xl font-bold opacity-80 hover:opacity-100 transition"
	style={`background: ${color};`}
>
	<a href={`/learn/${article.metadata.target}/${article.slug}`}>
		<img
			srcset={article.metadata.cover}
			class="w-full max-h-[200px] object-cover opacity-[30%]"
			alt="bg"
		/>
		<span class="absolute top-[30%] left-[10%]">{article.metadata.title}</span>
	</a>
</div>
