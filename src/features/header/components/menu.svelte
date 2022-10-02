<script lang="ts">
	import { CONFIG } from '@config'
</script>

<ul class="flex gap-16 float-right">
	{#each CONFIG.navigation.pages as page}
		<li>
			<a href={page.path}>
				{page.name}
			</a>
		</li>
	{/each}
</ul>
