<script>
	import Hamburger from './hamburger.svelte'
	import Menu from './menu.svelte'
	
	export let sidebar = false
</script>

<header class="flex shadow-xl px-16 py-4 rounded-bl-[30px] bg-primary-600 w-full h-[90px] justify-between">
	
	<div class="flex"> 
		<nav class="flex">
			<Hamburger bind:open={sidebar}/>
		</nav>

		<img class="w-80px h-[40px]" src="/assets/general/logo-text.svg" alt="logo" />
	</div>

	<nav class="text-white justify-self-end font-semibold text-xl self-center hidden lg:block">
		<Menu/>
	</nav>
	
</header>