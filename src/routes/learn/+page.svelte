<script lang="ts">
	import { Button } from '@features/ui-core'
</script>

<section class="mt-[180px] mb-16 px-8">
	<div class=" max-w-4xl h-full mx-auto flex lg:flex-row flex-col justify-between gap-16">
		<div class="shadow w-full flex flex-col justify-end h-[400px] bg-slate-200 rounded-lg p-16">
			<a href="/learn/newbie">
				<Button rounded="full" width="full" className="text-3xl py-6">Newbie</Button>
			</a>
		</div>
		<div class="shadow w-full flex flex-col justify-end h-[400px] bg-slate-200 rounded-lg p-16">
			<a href="/learn/expert">
				<Button rounded="full" width="full" className="text-3xl py-6">Expert</Button>
			</a>
		</div>
	</div>
</section>
