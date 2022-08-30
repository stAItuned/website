<script lang="ts">
	import type { Article } from '@lib/notion'

	// populated with data from the endpoint
	export let article: Article

	import { onMount } from 'svelte';

	let equ1 = `$$\\quad$$`;

	onMount(() => {
		
		let script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
    document.head.append(script);
		
		script.onload = () => {
      MathJax = {
        tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
        svg: {fontCache: 'global'}
      };
		};
					  
	});
</script>



<article class="prose prose-xl text-sm md:text-md lg:text-lg m-auto mt-10 mb-20">
	<!-- the title is already inside the article -->
		
	<!--
	<h1 class="text-4xl w-auto m-auto tracking-wide">
		{article.meta.title.trim()}
	</h1> -->

	<!-- it doesn't render latex from notion the first run without an already rendered element
		 Workaround: display a "tab" in latex -->
	<!-- {equ1} -->

	{@html article.parsedContent}
</article>
