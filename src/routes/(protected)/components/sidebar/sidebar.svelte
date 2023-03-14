<script lang='ts'>
	import { Navigation } from '@protected/components/sidebar'
	import { Drawer } from 'flowbite-svelte'
	import { sineIn } from 'svelte/easing'

	export let hidden: boolean
	const closeSidebar = () => hidden = true

	const transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	}
</script>


<div class='hidden xl:block w-1/5'>
	<Navigation />
</div>
<Drawer
	transitionType='fly'
	{transitionParams}
	class='xl:hidden p-0'
	bind:hidden>
	<Navigation {closeSidebar} />
</Drawer>
