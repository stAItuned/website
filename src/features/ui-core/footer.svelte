<script>
	import { SOCIALS } from '@lib/constants'
	import JoinUS from '../../assets/footer/JoinUS.svg'
</script>

<footer
	class="px-16 py-8 rounded-t-[30px] bg-primary-600 lg:grid lg:grid-cols-3 flex flex-col justify-self-end items-center space-y-10 lg:space-y-0"
>
	<div class=" bg-themes flex space-x-4 justify-start">
		{#each SOCIALS as social}
			<a href={social.url} target="_blank">
				<img src={social.image} alt={`${social.name}-logo`} />
			</a>
		{/each}
	</div>

	<div class="justify-self-center">
		<a href="/keepintouch">
			<img src={JoinUS} alt="JoinUS" />
		</a>
		<p class="mt-3 text-center text-sm text-gray-500">Copyright ©stAItuned</p>
	</div>

	<!--<a href="/keepintouch" class="text-end text-xl font-bold text-white uppercase m-0">
		Keep in touch
	</a>-->
</footer>
