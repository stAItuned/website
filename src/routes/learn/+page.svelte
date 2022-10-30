<script lang="ts">
	// @ts-ignore
	import newbieCard from '@assets/learn/newbie-card.png?w=600?webp'
	// @ts-ignore
	import expertCard from '@assets/learn/expert-card.png?w=600?webp'

	import { page } from '$app/stores'

	import { Filters } from '@lib/configs'
	import { utils } from '@lib/helpers'
	import { Button, Breadcrumb, PageTransition } from '@components/ui-core'
	import LearnPageMetaTags from '@lib/seo/LearnPageMetaTags.svelte'

	const pathname = $page.url.pathname
</script>

<LearnPageMetaTags />

<PageTransition>
	<section class="max-w-7xl mx-auto mt-[150px] mb-32 px-4 space-y-16">
		<Breadcrumb tabs={utils.getTabsFromPathname(pathname)} />
		<div class="flex lg:flex-row flex-col justify-between gap-16">
			{#each Filters.TARGETS as target}
				<div class="w-full px-8">
					<a href={`/learn/${target.toLowerCase()}`} class="items-center flex flex-col">
						<img
							srcset={target === 'Newbie' ? newbieCard : expertCard}
							class="w-64 h-64 hover:scale-125 transition"
							alt="target card"
						/>
						<Button rounded="full" width="full" className="text-3xl py-6 z-10">{target}</Button>
					</a>
				</div>
			{/each}
		</div>
	</section>
</PageTransition>
