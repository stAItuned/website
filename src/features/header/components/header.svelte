<script lang="ts">
	import Navigation from './navigation.svelte'
</script>

<header
	class="flex shadow-xl px-16 py-4 rounded-bl-[30px] bg-primary-600 w-full h-[90px] justify-between"
>
	<img class="w-80px h-[40px] object-contain" src="/assets/general/logo-text.svg" alt="logo" />

	<nav class="text-white self-end font-semibold text-xl">
		<Navigation />
	</nav>
</header>
