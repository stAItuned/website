<script lang="ts">
	import FaGoogle from 'svelte-icons/fa/FaGoogle.svelte'
	import FaDiscord from 'svelte-icons/fa/FaDiscord.svelte'
	import FaGithub from 'svelte-icons/fa/FaGithub.svelte'
	import FaLinkedIn from 'svelte-icons/fa/FaLinkedinIn.svelte'

	const baseUrl = 'http://localhost:1337/api/connect'

	const providers = [
		{ name: 'google', icon: FaGoogle, redirect: `${baseUrl}/google` },
		{ name: 'discord', icon: FaDiscord, redirect: `${baseUrl}/discord` },
		{ name: 'github', icon: FaGithub, redirect: `${baseUrl}/github` },
		{ name: 'linkedin', icon: FaLinkedIn, redirect: `${baseUrl}/linkedin` }
	]
</script>

<div class="flex space-x-2 items-center justify-between">
	{#each providers as provider}
		<a
			href={provider.redirect}
			class={'bg-slate-100 text-slate-50 flex justify-center py-2 px-5 w-1/4 rounded-lg ' +
				provider.name}
		>
			<div class="w-7 h-7">
				<svelte:component this={provider.icon} />
			</div>
		</a>
	{/each}
</div>

<style>
	.google {
		@apply bg-rose-500;
	}
	.discord {
		@apply bg-purple-500;
	}
	.github {
		@apply bg-slate-700;
	}
	.linkedin {
		@apply bg-blue-500;
	}
</style>
