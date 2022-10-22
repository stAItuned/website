<script lang="ts">
	import SidebarWrapper from './wrapper.svelte'
	import Nav from '../nav.svelte'

	export let open: boolean
</script>

<SidebarWrapper {open} className="bg-primary-600 lg:hidden">
	<center>
		<nav class="py-4 text-3xl text-white font-bold border-t-2 border-slate-500 mx-10 mt-32">
			<Nav onClick={() => (open = false)} />
		</nav>
	</center>
</SidebarWrapper>
