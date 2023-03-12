<script>
	// @ts-ignore
	import logoDark from '@assets/general/logo-dark.png?w=600?webp'
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Badge, Button } from 'flowbite-svelte'
</script>

<Navbar
	let:hidden
	let:toggle
	fluid={false}
	navClass="px-2 sm:px-4 py-2.5 w-full bg-slate-50 border-b !border-slate-300"
	navDivClass="px-4 flex flex-wrap justify-between items-center"
>
	<NavBrand href="/dashboard">
		<img src={logoDark} class="mr-4 h-6 sm:h-12" alt="Staituned Logo" />
		<div class="flex space-x-2 uppercase">
			<span
				class="self-center whitespace-nowrap text-sm font-black dark:text-white tracking-widest"
			>
				Author panel
			</span>
			<Badge><span class="font-bold">Beta</span></Badge>
		</div>
	</NavBrand>
	<NavHamburger on:click={toggle} />
	<NavUl {hidden} ulClass="flex items-center space-x-8">
		<NavLi href="/" active={false}>Blog</NavLi>
		<NavLi>
			<Button href="/articles/new">Write a new article</Button>
		</NavLi>
	</NavUl>
</Navbar>
