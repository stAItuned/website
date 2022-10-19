<script lang="ts">
	import logo from '../../../assets/general/logo-text.svg'

	import SidebarWrapper from './wrapper.svelte'
	import Nav from '../nav.svelte'

	export let open: boolean
</script>

<SidebarWrapper {open} className="bg-primary-600 lg:hidden">
	<center>
		<nav class="py-4 text-3xl text-white font-bold divide-y-2 px-10">
			<div class="mb-10">
				<a on:click={() => (open = false)} href="/">
					<img class="h-[40px]" src={logo} alt="logo" />
				</a>
			</div>

			<Nav onClick={() => (open = false)} />
		</nav>
	</center>
</SidebarWrapper>
