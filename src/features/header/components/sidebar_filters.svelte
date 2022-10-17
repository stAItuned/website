<script lang="ts">
	import { fly } from 'svelte/transition'
	import { backInOut } from 'svelte/easing'
	import dayjs from 'dayjs'
	import type { Article } from '@lib/git/types'

	export let open_filters = false
	export let articles: Article[]
	export let filteredArticles: Article[]
	// export let action: (filterArticles: (articles: Article[]) => Article[]) => void

	const tags = [
		'Basic',
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

	const applyFilters = () => {
		filteredArticles = articles
		filteredArticles = filteredArticles.filter((article) => {
			return (
				article.metadata.topics.some((topic) => activeFilters.tags.includes(topic as any)) &&
				((activeFilters.dates !== 'Always' &&
					((activeFilters.dates === 'Last month' &&
						dayjs(article.metadata.date).isAfter(dayjs().subtract(1, 'month'))) ||
						(activeFilters.dates === 'Last week' &&
							dayjs(article.metadata.date).isAfter(dayjs().subtract(1, 'week'))))) ||
					activeFilters.dates === 'Always') &&
				activeFilters.languages.includes(article.metadata.language as any)
			)
		})
		open_filters = !open_filters
	}

	// const updateArticles = (activeFilters: Filters) => {
	// 	action((articles) => {
	// 		const filter = (article: Article): boolean => {
	// 			if (
	// 				activeFilters.tags.length > 0 &&
	// 				article.metadata.topics.every((tag) => !activeFilters.tags.includes(tag as any))
	// 			) {
	// 				// If articles topics dont match any active filter tags, filter out
	// 				return false
	// 			}
	// 			if (
	// 				activeFilters.languages.length > 0 &&
	// 				!activeFilters.languages.includes(article.metadata.language as any)
	// 			) {
	// 				return false
	// 			}
	// 			const dayInMs: number = 1000 * 60 * 60 * 24
	// 			let timeSlice: number = 0
	// 			if (activeFilters.dates === 'Last month') {
	// 				timeSlice = dayInMs * 31
	// 			}
	// 			if (activeFilters.dates === 'Last week') {
	// 				timeSlice = dayInMs * 7
	// 			}
	// 			if (activeFilters.dates !== 'Always') {
	// 				const diffFromToday = new Date().valueOf() - new Date(article.metadata.date).valueOf()
	// 				if (diffFromToday >= timeSlice) {
	// 					return false
	// 				}
	// 			}
	// 			if (
	// 				activeFilters.searchFilter !== '' &&
	// 				!article.metadata.title.toLowerCase().includes(activeFilters.searchFilter)
	// 			) {
	// 				return false
	// 			}
	// 			return true
	// 		}

	// 		return articles.filter(filter)
	// 	})
	// }

	// $: updateArticles(activeFilters)

	// const addOrRemove = <T extends keyof Filters = keyof Filters>(value: any, place: T) => {
	// 	if (place === 'tags') {
	// 		if (activeFilters.tags.includes(value)) {
	// 			activeFilters.tags = activeFilters.tags.filter((t) => t !== value)
	// 		} else {
	// 			activeFilters.tags = [value, ...activeFilters.tags]
	// 		}
	// 	}
	// 	if (place === 'dates') {
	// 		activeFilters.dates = value
	// 	}
	// 	if (place === 'languages') {
	// 		if (activeFilters.languages.includes(value)) {
	// 			activeFilters.languages = activeFilters.languages.filter((l) => l !== value)
	// 		} else {
	// 			activeFilters.languages = [value, ...activeFilters.languages]
	// 		}
	// 	}
	// }

	const add = <T extends keyof Filters = keyof Filters>(value: any, place: T) => {
		switch (place) {
			case 'tags':
				activeFilters.tags = [...activeFilters.tags, value]
				break
			case 'dates':
				activeFilters.dates = value
				break
			case 'languages':
				activeFilters.languages = [...activeFilters.languages, value]
				break
			default:
				break
		}
	}

	const remove = <T extends keyof Filters = keyof Filters>(value: any, place: T) => {
		switch (place) {
			case 'tags':
				activeFilters.tags = activeFilters.tags.filter((tag) => tag !== value)
				break
			case 'languages':
				activeFilters.languages = activeFilters.languages.filter((lang) => lang !== value)
				break
			default:
				break
		}
	}
</script>

{#if open_filters}
	<aside
		class="absolute w-full md:w-1/2 xl:w-1/3 bg-[#F5F5F5] h-full top-0 z-20 right-0"
		transition:fly={{ duration: 300, easing: backInOut, x: 200 }}
	>
		<div class="h-screen flex flex-col justify-between p-16">
			<h1 class="font-bold text-2xl text-primary-500 uppercase">Filters</h1>

			<!-- TAGS -->
			<div class="space-y-4">
				<h1 class="font-bold text-xl text-primary-500">Tags</h1>
				<div class="flex flex-wrap gap-2">
					{#each tags as tag}
						{#if activeFilters.tags.includes(tag)}
							<button
								class="rounded-lg p-2 text-sm font-semibold bg-primary-500 hover:bg-primary-400 active:bg-primary-500 transition text-white"
								on:click={() => remove(tag, 'tags')}
							>
								<span>{tag}</span>
							</button>
						{:else}
							<button
								class="rounded-lg text-primary-500 p-2 text-sm font-semibold bg-gray-200 hover:bg-primary-400 active:bg-primary-500 transition hover:text-white"
								on:click={() => add(tag, 'tags')}
							>
								<span>{tag}</span>
							</button>
						{/if}
					{/each}
				</div>
			</div>

			<!-- DATE -->
			<!-- Always should be activated by default, but how could I -->
			<div class="space-y-4">
				<h1 class="font-bold text-xl text-primary-500">Creation Date</h1>
				<div class="flex flex-col gap-2 w-fit">
					{#each dates as date}
						{#if activeFilters.dates.includes(date)}
							<button
								class="rounded-lg p-2 text-sm font-semibold bg-primary-500 hover:bg-primary-400 active:bg-primary-500 transition text-white"
							>
								<span>{date}</span>
							</button>
						{:else}
							<button
								class="rounded-lg text-primary-500 p-2 text-sm font-semibold bg-gray-200 hover:bg-primary-400 active:bg-primary-500 transition hover:text-white"
								on:click={() => add(date, 'dates')}
							>
								<span>{date}</span>
							</button>
						{/if}
					{/each}
				</div>
			</div>

			<!-- Reading time -->
			<!-- As before -->

			<div class="space-y-4">
				<h1 class="font-bold text-xl text-primary-500">Languages</h1>
				<div class="flex gap-2 w-fit">
					{#each languages as lang}
						{#if activeFilters.languages.includes(lang)}
							<button
								class="rounded-lg p-2 text-sm font-semibold bg-primary-500 hover:bg-primary-400 active:bg-primary-500 transition text-white"
								on:click={() => remove(lang, 'languages')}
							>
								<span>{lang}</span>
							</button>
						{:else}
							<button
								class="rounded-lg text-primary-500 p-2 text-sm font-semibold bg-gray-200 hover:bg-primary-400 active:bg-primary-500 transition hover:text-white"
								on:click={() => add(lang, 'languages')}
							>
								<span>{lang}</span>
							</button>
						{/if}
					{/each}
				</div>
			</div>

			<button
				class="p-3 bg-stayYellow-600 hover:bg-stayYellow-400 active:bg-stayYellow-500 transition text-primary-500 rounded-lg"
				on:click={applyFilters}
			>
				<span class="font-semibold">Apply</span>
			</button>
		</div>
	</aside>
{/if}
