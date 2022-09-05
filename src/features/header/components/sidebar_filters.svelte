<script>
	import { fly } from 'svelte/transition'
	import { backInOut } from 'svelte/easing'

	export let open_filters = false

	let tags = ['Machine Learning', 'Computer Vision', 'Finance', 'NLP', 'Edge AI', 'Healthcare']
	let dates = ['Last week', 'Last month', 'Always']
	let reading_times = ["< 5'", "< 10'", 'Any']
</script>

{#if open_filters}
	<aside
		class="inline-block  absolute mt-24 z-10 sm:w-4/5 md:w-2/5 lg:w-1/5 h-full bg-[#F5F5F5] border-r-2 shadow-lg pl-10 "
		transition:fly={{ duration: 300, easing: backInOut, x: 200 }}
	>
		<!-- TAGS -->
		<div class="inline-block min-w-full">
			<p class="text-bold underline text-xl lg:text-2xl mt-10 text-primary-500">Tags</p>

			<div class="w-full ">
				{#each tags as t}
					<input type="checkbox" class="check-with-label" style="display: none;" id={t} />
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
					hover:bg-primary-600
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
					<input type="radio" class="check-with-label ml-1 " id={d} name="date" />
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
						hover:bg-primary-600
						hover:text-white"
						for={d}>{d}</label
					><br />
				{/each}
			</div>
		</div>

		<!-- Reading time -->
		<!-- As before -->

		<div class="inline-block min-w-full mt-2">
			<p class="text-bold underline text-xl lg:text-2xl pt-30 text-primary-500">Reading time</p>
			<div class="overflow-hidden float-left">
				{#each reading_times as r}
					<input type="radio" class="check-with-label ml-1 " id={r} name="reading" />
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
						hover:bg-primary-600
						hover:text-white"
						for={r}>{r}</label
					><br />
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
