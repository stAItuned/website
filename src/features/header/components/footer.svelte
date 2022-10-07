<script>
	import Instagram from '../../../assets/footer/Instagram.svg'
	import LinkedIn from '../../../assets/footer/LinkedIn.svg'
	import Facebook from '../../../assets/footer/Facebook.svg'
	import TikTok from '../../../assets/footer/Tiktok.svg'
	import JoinUS from '../../../assets/footer/JoinUS.svg'
</script>

<footer
	class="px-16 py-8 rounded-t-[30px] bg-primary-600 lg:grid lg:grid-cols-3 flex flex-col items-center space-y-10 lg:space-y-0"
>
	<div class=" bg-themes flex space-x-4 justify-start">
		<a href="https://www.linkedin.com/company/stai-tuned/" target="_blank">
			<img src={LinkedIn} alt="linkedin-logo" />
		</a>
		<a href="https://www.instagram.com/stai.tuned/" target="_blank">
			<img src={Instagram} alt="ig-logo" />
		</a>
		<a href="https://www.facebook.com/stAItuned" target="_blank">
			<img src={Facebook} alt="facebook-logo" />
		</a>
		<a href="https://www.tiktok.com/@staituned?lang=en" target="_blank">
			<img src={TikTok} alt="tiktok-logo" />
		</a>
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
