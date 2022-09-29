<script lang="ts">
	import { fly } from 'svelte/transition'
	import { backInOut } from 'svelte/easing'
	import type { Article } from '@lib/git/types'

	export let open_filters = false
	export let action: (filterArticles: (articles: Article[]) => Article[]) => void

	const tags = [
		'Machine Learning',
		'Computer Vision',
		'Finance',
		'NLP',
		'Edge AI',
		'Healthcare',
		'Deep Learning'
	] as const
	const dates = ['Last week', 'Last month', 'Always'] as const
	const reading_times = ["< 5'", "< 10'", 'Any'] as const
	const languages = ['English', 'Italian'] as const

	interface Filters {
		tags: typeof tags[number][]
		dates: typeof dates[number]
		readingTime: typeof reading_times[number]
		languages: typeof languages[number][]
		searchFilter: string
	}

	const activeFilters: Filters = {
		tags: [...tags],
		dates: 'Always',
		readingTime: 'Any',
		languages: [...languages],
		searchFilter: ''
	}
	const updateArticles = (activeFilters: Filters) => {
		action((articles) => {
			const filter = (article: Article): boolean => {
				if (
					activeFilters.tags.length > 0 &&
					article.metadata.topics.every((tag) => !activeFilters.tags.includes(tag as any))
				) {
					// If articles topics dont match any active filter tags, filter out
					return false
				}
				if (
					activeFilters.languages.length > 0 &&
					!activeFilters.languages.includes(article.metadata.language as any)
				) {
					return false
				}
				const dayInMs: number = 1000 * 60 * 60 * 24
				let timeSlice: number = 0
				if (activeFilters.dates === 'Last month') {
					timeSlice = dayInMs * 31
				}
				if (activeFilters.dates === 'Last week') {
					timeSlice = dayInMs * 7
				}
				if (activeFilters.dates !== 'Always') {
					const diffFromToday = new Date().valueOf() - new Date(article.metadata.date).valueOf()
					if (diffFromToday >= timeSlice) {
						return false
					}
				}
				if (
					activeFilters.searchFilter !== '' &&
					!article.metadata.title.toLowerCase().includes(activeFilters.searchFilter)
				) {
					return false
				}
				return true
			}

			return articles.filter(filter)
		})
	}

	$: updateArticles(activeFilters)

	const addOrRemove = <T extends keyof Filters = keyof Filters>(value: any, place: T) => {
		if (place === 'tags') {
			if (activeFilters.tags.includes(value)) {
				activeFilters.tags = activeFilters.tags.filter((t) => t !== value)
			} else {
				activeFilters.tags = [value, ...activeFilters.tags]
			}
		}
		if (place === 'dates') {
			activeFilters.dates = value
		}
		if (place === 'languages') {
			if (activeFilters.languages.includes(value)) {
				activeFilters.languages = activeFilters.languages.filter((l) => l !== value)
			} else {
				activeFilters.languages = [value, ...activeFilters.languages]
			}
		}
	}
</script>

<input
	type="text"
	class="
                mt-10 mb-10 m-auto
                col-span-4
                block
                w-4/6
                rounded-xl
                shadow-xl"
	placeholder="  Search"
	bind:value={activeFilters.searchFilter}
/>

{#if open_filters}
	<aside
		class="inline-block  absolute mt-0 z-10 sm:w-4/5 md:w-2/5 lg:w-1/5 h-full bg-[#F5F5F5] border-r-2 shadow-lg pl-10 "
		transition:fly={{ duration: 300, easing: backInOut, x: 200 }}
	>
		<!-- TAGS -->
		<div class="inline-block min-w-full">
			<p class="text-bold underline text-xl lg:text-2xl mt-10 text-primary-500">Tags</p>

			<div class="w-full ">
				{#each tags as t}
					<input
						type="checkbox"
						class="check-with-label"
						style="display: none;"
						on:click={() => addOrRemove(t, 'tags')}
						id={t}
						checked={activeFilters.tags.includes(t)}
					/>
					<label
						class="
					label-for-check
					left
					rounded-lg 
					bg-gray-200
					border-[#1A1E3B]
					p-2 m-2
					inline-block
					sm:text-sm md:text-md
					hover:bg-primary-500
					hover:text-white"
						for={t}>{t}</label
					>
				{/each}
			</div>
		</div>

		<!-- DATE -->
		<!-- Always should be activated by default, but how could I -->
		<div class="inline-block min-w-full mt-2">
			<p class="text-bold underline text-xl lg:text-2xl pt-30 text-primary-500">Creation date</p>
			<div class="overflow-hidden float-left">
				{#each dates as d}
					<input
						type="radio"
						class="radio-with-label ml-1 "
						id={d}
						on:click={() => addOrRemove(d, 'dates')}
						name="date"
					/>
					<label
						class="
						label-for-check
						left
						rounded-lg 
						bg-gray-200
						border-[#1A1E3B]
						p-2 m-2
						inline-block
						sm:text-sm md:text-md
						hover:bg-primary-500
						hover:text-white"
						for={d}>{d}</label
					><br />
				{/each}
			</div>
		</div>

		<!-- Reading time -->
		<!-- As before -->

		<div class="inline-block min-w-full mt-2">
			<p class="text-bold underline text-xl lg:text-2xl pt-30 text-primary-500">Languages</p>
			<div class="overflow-hidden float-left">
				{#each languages as l}
					<input
						type="checkbox"
						class="check-with-label"
						style="display: none;"
						id={l}
						name="languages"
						on:click={() => addOrRemove(l, 'languages')}
						checked={activeFilters.languages.includes(l)}
					/>
					<label
						class="
						label-for-check
						left
						rounded-lg 
						bg-gray-200
						border-[#1A1E3B]
						p-2 m-2
						inline-block
						sm:text-sm md:text-md
						hover:bg-primary-500
						hover:text-white"
						for={l}>{l}</label
					>
				{/each}
			</div>
		</div>
	</aside>
{/if}

<style>
	aside {
		right: 0;
	}

	.check-with-label:checked + .label-for-check {
		background-color: rgb(26 30 59);
		color: white;
	}
</style>
