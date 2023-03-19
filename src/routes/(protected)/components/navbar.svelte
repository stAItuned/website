<script>
	// @ts-ignore
	import logoDark from '@assets/general/logo-dark.png?w=600?webp'
	import { Badge, Button, Navbar, NavBrand, NavHamburger, NavLi, NavUl } from 'flowbite-svelte'

	export let openSidebar
</script>

<Navbar
	fluid={false}
	class='!bg-slate-100 border-b !border-slate-300'>
	<NavBrand href='/dashboard'>
		<img src={logoDark} class='mr-4 h-6 sm:h-10' alt='Staituned Logo' />
		<div class='flex space-x-2 uppercase'>
			<span class='self-center text-sm font-black'>Author panel</span>
			<Badge><span class='font-bold'>Beta</span></Badge>
		</div>
	</NavBrand>
	<NavHamburger class='!block xl:!hidden' on:click={openSidebar} />
	<NavUl class='!hidden xl:!block'>
		<div class='flex items-center space-x-8'>
			<NavLi href='/'>Go back to the blog</NavLi>
			<NavLi>
				<Button shadow='blue' gradient color='blue' href='/articles/new'>Write a new article</Button>
			</NavLi>
		</div>
	</NavUl>

</Navbar>
