<script lang="ts">
	// @ts-ignore
	import JoinUS from '@assets/footer/JoinUS.svg?w=256?webp'

	import { SOCIALS } from '@lib/configs'
</script>

<footer
	class="px-16 py-8 rounded-t-[30px] bg-primary-600 lg:grid lg:grid-cols-3 flex flex-col justify-self-end items-center space-y-10 lg:space-y-0"
>
	<div class="flex flex-col gap-4">
		<h3 class="text-lg uppercase text-slate-200 opacity-25 font-bold">Follow us</h3>
		<div class="flex space-x-8 justify-start">
			{#each SOCIALS as social}
				<a href={social.url} target="_blank">
					<social.icon class="w-10 h-10" />
					<svelte:component
						this={social.icon}
						class="w-10 h-10 text-slate-200 opacity-25 hover:opacity-100 transition"
					/>
				</a>
			{/each}
		</div>
	</div>

	<div class="justify-self-center">
		<a href="/keepintouch">
			<img srcset={JoinUS} alt="JoinUS" />
		</a>
		<p class="mt-3 text-center text-sm text-gray-500">Copyright ©stAItuned</p>
	</div>

	<!--<a href="/keepintouch" class="text-end text-xl font-bold text-white uppercase m-0">
		Keep in touch
	</a>-->
</footer>
