<script lang="ts">
	import type { PageData } from './$types'

	import { page } from '$app/stores'

	import { Meet } from '@lib/configs'
	import type { Author } from '@lib/interfaces'
	import { Cards, Breadcrumb, PageTransition } from '@features/ui-core'

	export let data: PageData
	const authors: Author[] = data.authors

	const team = $page.params.team

	let filterAuthors = authors.filter((author) =>
		author.team.map((t) => t.toLowerCase()).includes(team)
	)

	let order: string[] = []

	if (team == 'tech') {
		order = Meet.TECH_ORDER
	} else if (team == 'marketing') {
		order = Meet.MARKETING_ORDER
	}

	if (team == 'tech' || team == 'marketing') {
		let arr: Author[] = []
		order.forEach((name) => {
			const authFound = filterAuthors.find((a) => a.name === name)
			if (authFound) arr.push(authFound)
		})
		filterAuthors = arr
	} else {
		filterAuthors = filterAuthors.sort(
			(a, b) =>
				(b.articles?.reduce((prev, curr) => prev + curr.metadata.readingTime, 0) ?? 0) -
				(a.articles?.reduce((prev, curr) => prev + curr.metadata.readingTime, 0) ?? 0)
		)
	}
</script>

<PageTransition>
	<div class="max-w-7xl mx-auto mb-16 mt-[150px] space-y-16 px-8 lg:px-4">
		<div class="flex flex-col md:flex-row gap-8 items-center justify-between px-8">
			<Breadcrumb />
			<h1 class="font-bold text-4xl text-center text-primary-500 uppercase">
				{team} team
			</h1>
		</div>
		<div class="flex flex-wrap justify-center">
			{#each filterAuthors as author}
				<Cards.Team {author} />
			{/each}
		</div>
	</div>
</PageTransition>
