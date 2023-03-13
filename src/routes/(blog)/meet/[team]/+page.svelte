<script lang="ts">
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	import { Teams } from '@lib/configs'
	import type { Article, Author } from '@lib/interfaces'
	import { utils, authors as authorsHelper } from '@lib/helpers'
	import { Breadcrumb } from '@shared/components/ui-core'
	import { Cards } from '@shared/components/features'

	export let data: PageData

	const authors: Author[] = data.authors
	const articles: Article[] = data.articles

	const team: typeof Teams.NAMES[number] = utils.toSentenceCase(
		$page.params.team
	) as typeof Teams.NAMES[number]

	const pathname = $page.url.pathname

	const order: string[] =
		team === 'Tech' ? Teams.TECH_ORDER : team === 'Marketing' ? Teams.MARKETING_ORDER : []

	const filteredAuthors: Author[] =
		team !== 'Writers'
			? authorsHelper.sortByOrder(authorsHelper.filterByTeam(authors, team), order)
			: authorsHelper.sortByArticlesReadingTime(authorsHelper.filterByTeam(authors, team), articles)
</script>

<div class="max-w-7xl mx-auto my-32 space-y-16 px-8 xl:px-4">
	<div class="flex flex-col md:flex-row gap-16 items-center justify-between xl:px-8">
		<Breadcrumb tabs={utils.getTabsFromPathname(pathname)} />
		<h1 class="font-bold text-4xl text-center text-primary-500 uppercase">
			{team} team
		</h1>
	</div>
	<div class="flex flex-wrap justify-center">
		{#each filteredAuthors as author}
			<Cards.TeamMember {author} />
		{/each}
	</div>
</div>
