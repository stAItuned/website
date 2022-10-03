<script lang="ts">
	import Hamburger from './hamburger.svelte'
	import Menu from './menu.svelte'
	import Sidebar from './sidebar.svelte'

	import logo from '../../../assets/general/logo-text.svg'

	export let openedSidebar: boolean
</script>

<Sidebar bind:open={openedSidebar} />

<header
	class="lg:flex shadow-xl px-16 py-6 rounded-b-[30px] bg-primary-600 w-full h-[90px] justify-between items-baseline"
>
	<div class="flex justify-between items-center">
		<a href="/">
			<img class="h-[30px] lg:h-[40px]" src={logo} alt="logo" />
		</a>

		<nav class="flex z-20 lg:hidden">
			<Hamburger bind:open={openedSidebar} />
		</nav>
	</div>

	<nav class="text-white font-semibold text-xl hidden lg:block">
		<Menu />
	</nav>
</header>
