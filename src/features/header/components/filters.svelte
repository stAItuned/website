<script>
	import HamburgerFilters from './hamburger_filters.svelte'
    import SidebarFilters from './sidebar_filters.svelte'
	
	export let open_filters = false
    
</script>

<div class="grid grid-cols-5">
		
    <input type="text" class="
                mt-10 mb-10 m-auto
                col-span-4
                block
                w-4/6
                rounded-xl
                shadow-xl" placeholder="  Search">


    <HamburgerFilters bind:open_filters/>

    <SidebarFilters bind:open_filters/>


</div>
