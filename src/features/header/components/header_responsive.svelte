<script>
	import Hamburger from './hamburger.svelte'
	import Menu from './menu.svelte'
	
	export let sidebar = false
</script>

<header class="flex shadow-xl pl-8 pr-4 py-4 
			   rounded-bl-[30px] bg-primary-600 
			   w-full h-[90px] 
			   justify-items-end">
	
	<div class="flex grid content-center grid-cols-2 w-screen justify"> 

		<a href="/" class="">
			<img class="h-[30px] md:h-[30px] lg:h-[40px]" src="/assets/general/logo-text.svg" alt="logo" />
		</a>

		<nav class="flex z-20 lg:invisible right justify-self-end" class:fixed={sidebar} class:py-4={sidebar}>
			<Hamburger bind:open={sidebar}/>
		</nav>
	</div>

	<nav class="text-white font-semibold text-xl self-center hidden lg:block w-full mr-10">
		<Menu/>
	</nav>
	
</header>