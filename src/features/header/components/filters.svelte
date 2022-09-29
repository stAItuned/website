<script lang="ts">
	import type { Article } from '@lib/git/types'
	import HamburgerFilters from './hamburger_filters.svelte'
	import SidebarFilters from './sidebar_filters.svelte'

	export let action: (filterArticles: (articles: Article[]) => Article[]) => void
	export let open_filters = false
</script>

<div>
	

	<HamburgerFilters bind:open_filters />

	<SidebarFilters  {action} bind:open_filters />
</div>
