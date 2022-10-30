<script lang="ts">
	import type { PageData } from './$types'
	import { page } from '$app/stores'

	import type { Author } from '@lib/interfaces'
	import { PageTransition } from '@lib/components/ui-core'
	import Breadcrumb from '@lib/components/ui-core/breadcrumb.svelte'
	import { utils } from '@lib/helpers'

	export let data: PageData
	const author: Author = data.author
	const pathname = $page.url.pathname
</script>

<svelte:head>
	<style>
		div.toc {
			display: none;
		}
	</style>
</svelte:head>

<PageTransition>
	<div class="max-w-7xl mx-auto mb-32 mt-[150px] space-y-16 px-8 xl:px-4">
		<div class="flex flex-col md:flex-row gap-16 items-center justify-between xl:px-8">
			<Breadcrumb tabs={['Meet', author.team[0], author.name]} />
			<h1 class="font-bold text-4xl text-center text-primary-500 uppercase">
				{author.name}
			</h1>
		</div>
		<div class="flex flex-wrap justify-center">
			<div class="grid grid-cols-2">
				<div class="flex flex-col">
					<p>{author.title}</p>
					<p>{author.description}</p>
				</div>
				<img src={author.propic} class="h-[25rem] lg:h-[30rem] object-cover" alt="Member propic" />
			</div>
			<svelte:component this={data.componentToRender} />
		</div>
	</div>
</PageTransition>
