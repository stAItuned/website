<script lang="ts">
	import { Filters } from '@lib/configs'
	import type { Filter } from '@lib/interfaces'

	import SidebarWrapper from './wrapper.svelte'
	import Hamburger from '../hamburger.svelte'
	import Button from '../button.svelte'

	export let open: boolean
	export let activeFilters: Filter
	export let filter: () => void

	const add = <T extends keyof Filter = keyof Filter>(value: any, place: T) => {
		switch (place) {
			case 'tags':
				activeFilters.tags = [...activeFilters.tags, value]
				break
			case 'creationDate':
				activeFilters.creationDate = value
				break
			case 'readingTime':
				activeFilters.readingTime = [...activeFilters.readingTime, value]
				break
			case 'languages':
				activeFilters.languages = [...activeFilters.languages, value]
				break
			default:
				break
		}
	}

	const remove = <T extends keyof Filter = keyof Filter>(value: any, place: T) => {
		switch (place) {
			case 'tags':
				activeFilters.tags = activeFilters.tags.filter((tag) => tag !== value)
				break
			case 'readingTime':
				activeFilters.readingTime = activeFilters.readingTime.filter((time) => time !== value)
				break
			case 'languages':
				activeFilters.languages = activeFilters.languages.filter((lang) => lang !== value)
				break
			default:
				break
		}
	}
</script>

<SidebarWrapper {open} className="md:w-1/2 xl:w-1/3 bg-[#F5F5F5] top-0 right-0">
	<div class="h-screen flex flex-col justify-between p-16">
		<div class="flex align-center justify-between">
			<h1 class="font-bold text-2xl text-primary-500 uppercase">Filters</h1>
			<Hamburger
				className="p-4 bg-secondary-600 hover:bg-secondary-500 active:bg-secondary-600 transition rounded-full"
				bind:open
			/>
		</div>

		<!-- TAGS -->
		<div class="space-y-4">
			<h1 class="font-bold text-xl text-primary-500">Tags</h1>
			<div class="flex flex-wrap gap-2">
				{#each Filters.TAGS as tag}
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
				{#each Filters.CREATION_DATES as date}
					{#if activeFilters.creationDate.includes(date)}
						<button
							class="rounded-lg p-2 text-sm font-semibold bg-primary-500 hover:bg-primary-400 active:bg-primary-500 transition text-white"
						>
							<span>{date}</span>
						</button>
					{:else}
						<button
							class="rounded-lg text-primary-500 p-2 text-sm font-semibold bg-gray-200 hover:bg-primary-400 active:bg-primary-500 transition hover:text-white"
							on:click={() => add(date, 'creationDate')}
						>
							<span>{date}</span>
						</button>
					{/if}
				{/each}
			</div>
		</div>

		<div class="space-y-4">
			<h1 class="font-bold text-xl text-primary-500">Reading Time</h1>
			<div class="flex gap-2 w-fit">
				{#each Filters.READING_TIME as time}
					{#if activeFilters.readingTime.includes(time)}
						<button
							class="rounded-lg p-2 text-sm font-semibold bg-primary-500 hover:bg-primary-400 active:bg-primary-500 transition text-white"
							on:click={() => remove(time, 'readingTime')}
						>
							<span>{time}</span>
						</button>
					{:else}
						<button
							class="rounded-lg text-primary-500 p-2 text-sm font-semibold bg-gray-200 hover:bg-primary-400 active:bg-primary-500 transition hover:text-white"
							on:click={() => add(time, 'readingTime')}
						>
							<span>{time}</span>
						</button>
					{/if}
				{/each}
			</div>
		</div>

		<div class="space-y-4">
			<h1 class="font-bold text-xl text-primary-500">Languages</h1>
			<div class="flex gap-2 w-fit">
				{#each Filters.LANGUAGES as lang}
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
		<Button variant="secondary" rounded="lg" width="full" onClick={filter}>Apply</Button>
	</div>
</SidebarWrapper>
