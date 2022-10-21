<script lang="ts">
	import { Filters } from '@lib/configs'
	import { Button, PageTransition } from '@features/ui-core'
</script>

<PageTransition>
	<section class="mt-[240px] mb-16 px-8">
		<div class=" max-w-4xl h-full mx-auto flex lg:flex-row flex-col justify-between gap-16">
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
