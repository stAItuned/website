<script lang="ts">
	import { Button } from '@components/ui-core'

	interface Team {
		name: string
		logo: string
	}

	export let team: Team
</script>

<a href={`/meet/${team.name.toLowerCase()}`}>
	<div
		class="flex flex-col items-center gap-8 opacity-50 hover:opacity-100 duration-500 transition"
	>
		<div class="hover:scale-125 duration-500 transition">
			<img srcset={team.logo} class="h-[200px]" alt="tech" />
		</div>

		<Button variant="primary" width="full" rounded="full" className="w-1/2 md:w-full">
			<span class="font-semibold text-2xl uppercase">{team.name}</span>
		</Button>
	</div>
</a>
