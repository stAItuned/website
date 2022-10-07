<script lang="ts">
	import { TeamCard } from '@features/blog/index'

	import type { Author } from '@lib/git/types'
	import type { PageData } from '.svelte-kit/types/src/routes/meet/[slug]/$types'

	import { page } from '$app/stores'

	export let data: PageData
	const authors: Author[] = data.authors

	let slug = $page.url.pathname.split('/')[2]
	const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1)

	let filterAuthors = authors.filter((author) => author.team.indexOf(capitalizedSlug) > -1)

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

	if (capitalizedSlug == 'Tech') {
		order = techOrder
	} else if (capitalizedSlug == 'Marketing') {
		order = marketingOrder
	}

	if (capitalizedSlug == 'Tech' || capitalizedSlug == 'Marketing') {
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

<div class="my-16 space-y-16 px-4">
	<h1 class="font-bold text-5xl text-primary-600 text-center uppercase">{capitalizedSlug} team</h1>
	<div class="flex flex-wrap justify-center gap-16">
		{#each filterAuthors as author}
			<TeamCard {author} />
		{/each}
	</div>
</div>
