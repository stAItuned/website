<script lang="ts">
	import { page } from '$app/stores'

	const tabs = $page.url.pathname
		.split('/')
		.slice(1)
		.map((tab) => tab[0].toUpperCase() + tab.slice(1))
</script>

<nav
	class="flex items-center space-x-4 text-primary-500 w-full md:w-fit bg-slate-100 px-8 py-4 rounded-lg text-lg font-semibold"
>
	{#each tabs as tab, idx}
		{#if idx === tabs.length - 1}
			<a
				class="text-xl truncate"
				href={`/${tabs
					.slice(0, idx + 1)
					.join('/')
					.toLowerCase()}`}>{decodeURIComponent(tab).replaceAll("-", " ")}</a
			>
		{:else}
			<a
				class="text-base opacity-50 hover:underline hover:opacity-100 transition"
				href={`/${tabs
					.slice(0, idx + 1)
					.join('/')
					.toLowerCase()}`}>{tab}</a
			>
		{/if}

		{#if idx < tabs.length - 1}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-6 h-6"
			>
				<path
					fill-rule="evenodd"
					d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
					clip-rule="evenodd"
				/>
			</svg>
		{/if}
	{/each}
</nav>
