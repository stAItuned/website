<script lang="ts">
	import type { Article } from '@lib/notion'

	// populated with data from the endpoint
	export let article: Article
</script>

<article class="prose prose-xl m-auto">
	<h1 class="text-6xl w-max m-auto">{article.title}</h1>

	{@html article.parsedContent}
</article>
