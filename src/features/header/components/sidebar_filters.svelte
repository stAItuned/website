<script lang="ts">
	import { fly } from 'svelte/transition'
	import { backInOut } from 'svelte/easing'

	import { HamburgerFilters } from '@features/header/index'
	import { Filters } from '@lib/constants'
	import type { Filter } from '@lib/interfaces'

	export let open_filters = false

	export let filter: () => void

	export let activeFilters: Filter

	const add = <T extends keyof Filter = keyof Filter>(value: any, place: T) => {
		switch (place) {
			case 'tags':
				activeFilters.tags = [...activeFilters.tags, value]
				break
			case 'creationDate':
				activeFilters.creationDate = value
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
		class="absolute w-full md:w-1/2 xl:w-1/3 bg-[#F5F5F5] h-full top-0 z-30 right-0"
		transition:fly={{ duration: 300, easing: backInOut, x: 200 }}
	>
		<div class="h-screen flex flex-col justify-between p-16">
			<div class="flex align-center justify-between">
				<h1 class="font-bold text-2xl text-primary-500 uppercase">Filters</h1>
				<HamburgerFilters bind:open_filters />
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

			<!-- Reading time -->
			<!-- As before -->

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

			<button
				class="p-3 bg-stayYellow-600 hover:bg-stayYellow-400 active:bg-stayYellow-500 transition text-primary-500 rounded-lg"
				on:click={filter}
			>
				<span class="font-semibold">Apply</span>
			</button>
		</div>
	</aside>
{/if}
