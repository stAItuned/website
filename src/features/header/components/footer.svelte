<script>
	import Instagram from '../../../assets/footer/Instagram.svg'
	import LinkedIn from '../../../assets/footer/LinkedIn.svg'
	import JoinUS from '../../../assets/footer/JoinUS.svg'
</script>

<footer
	class="px-16 py-6 rounded-t-[30px] bg-primary-600 items-center flex lg:flex-row flex-col gap-y-10 justify-between"
>
	<div class=" bg-themes flex gap-x-4">
		<a href="https://www.linkedin.com/company/stai-tuned/" target="_blank">
			<img src={LinkedIn} alt="linkedin-logo" />
		</a>
		<a href="https://www.instagram.com/stai.tuned/" target="_blank">
			<img src={Instagram} alt="ig-logo" />
		</a>
	</div>

	<div class="justify-self-center">
		<a href="/keepintouch">
			<img class="" src={JoinUS} alt="JoinUS" />
		</a>
		<p class="mt-2 text-center text-sm text-gray-500">Copyright ©stAItuned</p>
	</div>

	<a href="/keepintouch" class="text-center text-xl font-bold text-white uppercase m-0">
		Keep in touch
	</a>
</footer>
