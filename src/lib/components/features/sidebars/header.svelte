<script lang="ts">
	import { Sidebar, Nav } from '@components/ui-core'

	export let open: boolean
</script>

<Sidebar {open} className="bg-primary-600 lg:hidden">
	<center>
		<nav class="py-4 text-3xl text-white font-bold border-t-2 border-slate-500 mx-10 mt-32">
			<Nav onClick={() => (open = false)} />
		</nav>
	</center>
</Sidebar>
