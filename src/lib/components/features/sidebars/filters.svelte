<script lang="ts">
	import { Filters } from '@lib/configs'
	import type { Filter } from '@lib/interfaces'

	import { Sidebar, Hamburger, Button, FilterButton } from '@components/ui-core'

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

<Sidebar {open} className="md:w-1/2 xl:w-1/3 bg-slate-50 top-0 right-0">
	<div class="h-screen flex flex-col justify-between p-8 lg:p-16">
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
						<FilterButton active handleClick={() => remove(tag, 'tags')} label={tag} />
					{:else}
						<FilterButton handleClick={() => add(tag, 'tags')} label={tag} />
					{/if}
				{/each}
			</div>
		</div>

		<!-- DATE -->
		<!-- Always should be activated by default, but how could I -->
		<div class="space-y-4">
			<h1 class="font-bold text-xl text-primary-500">Creation Date</h1>
			<div class="flex lg:flex-col gap-2 w-fit">
				{#each Filters.CREATION_DATES as date}
					{#if activeFilters.creationDate.includes(date)}
						<FilterButton active handleClick={() => remove(date, 'creationDate')} label={date} />
					{:else}
						<FilterButton handleClick={() => add(date, 'creationDate')} label={date} />
					{/if}
				{/each}
			</div>
		</div>

		<div class="space-y-4">
			<h1 class="font-bold text-xl text-primary-500">Reading Time</h1>
			<div class="flex gap-2 w-fit">
				{#each Filters.READING_TIME as time}
					{#if activeFilters.readingTime.includes(time)}
						<FilterButton active handleClick={() => remove(time, 'readingTime')} label={time} />
					{:else}
						<FilterButton handleClick={() => add(time, 'readingTime')} label={time} />
					{/if}
				{/each}
			</div>
		</div>

		<div class="space-y-4">
			<h1 class="font-bold text-xl text-primary-500">Languages</h1>
			<div class="flex gap-2 w-fit">
				{#each Filters.LANGUAGES as lang}
					{#if activeFilters.languages.includes(lang)}
						<FilterButton active handleClick={() => remove(lang, 'languages')} label={lang} />
					{:else}
						<FilterButton handleClick={() => add(lang, 'languages')} label={lang} />
					{/if}
				{/each}
			</div>
		</div>
		<Button className="mb-16 sm:mb-0" variant="secondary" rounded="lg" width="full" onClick={filter}
			>Apply</Button
		>
	</div>
</Sidebar>
