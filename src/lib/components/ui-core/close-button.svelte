<script lang="ts">
	import Icons from './icons'

	export let open: boolean
</script>

<div on:click={() => (open = false)} class="text-slate-500 opacity-50 hover:opacity-100 transition">
	<Icons.Close clickable class="w-6 h-6" />
</div>
