<script lang="ts">
	import { Socials } from '@lib/configs'
	import { Sidebar, Nav } from '@shared/components/ui-core'

	export let open: boolean
</script>

<Sidebar {open} className="bg-primary-600 lg:hidden">
	<center>
		<nav
			class="py-4 text-4xl text-start text-white font-bold border-t-2 border-slate-500 mx-10 mt-32"
		>
			<Nav onClick={() => (open = false)} />
			<div class="absolute flex justify-between left-12 right-12 bottom-16">
				{#each Socials.ICON_LINKS as social}
					<a href={social.url} target="_blank" rel="noreferrer" aria-label="{social.name} icon">
						<social.icon class="w-10 h-10" />
						<svelte:component
							this={social.icon}
							class="w-10 h-10 text-slate-200 opacity-50 hover:opacity-100 transition"
						/>
					</a>
				{/each}
			</div>
		</nav>
	</center>
</Sidebar>
