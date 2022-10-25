<script lang="ts">
	import { page } from '$app/stores'

	import { Filters } from '@lib/configs'
	import { Button, Breadcrumb, PageTransition } from '@components/ui-core'
	import { utils } from '@lib/helpers'

	const pathname = $page.url.pathname
</script>

<PageTransition>
	<section class="max-w-7xl mx-auto mt-[150px] mb-32 px-8 xl:px-4 space-y-16">
		<Breadcrumb tabs={utils.getTabsFromPathname(pathname)} />
		<div class="flex lg:flex-row flex-col justify-between gap-16">
			{#each Filters.TARGETS as target}
				<div class="shadow w-full flex flex-col justify-end h-[400px] bg-slate-200 rounded-lg p-16">
					<a href={`/learn/${target.toLowerCase()}`}>
						<Button rounded="full" width="full" className="text-3xl py-6">{target}</Button>
					</a>
				</div>
			{/each}
		</div>
	</section>
</PageTransition>
