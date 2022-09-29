<script>
	import Hamburger from './hamburger.svelte'
	import Menu from './menu.svelte'
	
	export let sidebar = false
</script>

<header class="flex shadow-xl px-16 py-4 rounded-bl-[30px] bg-primary-600 w-full h-[90px] justify-between">
	
	<div class="flex grid content-center grid-cols-4"> 
		
		<nav class="flex z-20 lg:invisible" class:fixed={sidebar} class:py-4={sidebar}>
			<Hamburger bind:open={sidebar}/>
		</nav>

		<a href="/" class="col-span-3">
			<img class="h-[30px] md:h-[30px] lg:h-[40px]" src="/assets/general/logo-text.svg" alt="logo" />
		</a>
	</div>

	<nav class="text-white justify-self-end font-semibold text-xl self-center hidden lg:block">
		<Menu/>
	</nav>
	
</header>