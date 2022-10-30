<script lang="ts">
	import { utils } from '@lib/helpers'
	import Icons from './icons'

	export let tabs: string[]

	const activeClass = 'text-base lg:text-xl truncate'
	const defaultClass = 'text-sm lg:text-base opacity-50 hover:underline hover:opacity-100 transition'
</script>

<nav
	class="flex items-center space-x-4 text-primary-500 w-full md:w-fit bg-slate-100 px-8 py-4 rounded-lg font-semibold"
>
	{#each tabs as tab, idx}
		<a
			class={idx === tabs.length - 1 ? activeClass : defaultClass}
			href={utils.getPathnameFromTabs(tabs, idx + 1)}
			>{decodeURIComponent(tab).replaceAll('-', ' ')}</a
		>

		{#if idx < tabs.length - 1}
			<div>
				<Icons.ChevronRight class="w-5 h-5" />
			</div>
		{/if}
	{/each}
</nav>
