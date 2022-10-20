<script lang="ts">
	import { Cards } from '@features/ui-core'

	import type { Author } from '@lib/git/types'
	import type { PageData } from '.svelte-kit/types/src/routes/meet/[slug]/$types'

	import { page } from '$app/stores'

	export let data: PageData
	const authors: Author[] = data.authors

	let filterAuthors = authors.filter((author) =>
		author.team.map((t) => t.toLowerCase()).includes($page.params.team)
	)

	// clean this part and add it on an external file?
	const techOrder = [
		'Daniele Moltisanti',
		'Francesco Di Salvo',
		'Davide Nardini',
		'Alex Buffa',
		'Francesco Di Gangi'
	]
	const marketingOrder = [
		'Roberta Ghidini',
		'Alessandra Lo Chirco',
		'Alice Ghidini',
		'Davide Scurto',
		'Emanuele Migliore',
		'Francesca Cancelliere',
		'Gerarda Malanga',
		'Sofia Pedrini',
		'Valeria Tardio'
	]
	let order: string[] = []

	if ($page.params.team == 'tech') {
		order = techOrder
	} else if ($page.params.team == 'marketing') {
		order = marketingOrder
	}

	if ($page.params.team == 'tech' || $page.params.team == 'marketing') {
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

<div class="mb-16 mt-[150px] space-y-16 px-4">
	<h1 class="font-bold text-5xl text-primary-600 text-center uppercase">
		{$page.params.team} team
	</h1>
	<div class="flex flex-wrap justify-center gap-16">
		{#each filterAuthors as author}
			<Cards.Team {author} />
		{/each}
	</div>
</div>
