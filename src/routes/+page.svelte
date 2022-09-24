<script lang="ts">
	import info from '@lib/info'
</script>

<svelte:head>
	<title>{info.siteName}</title>
	<!-- HTML Meta Tags -->
	<title>{info.siteName}</title>
	<meta name="description" content={info.longDescription} />

	<!-- Facebook Meta Tags -->
	<!-- <meta property="og:url" content={window.location.hostname} /> -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={info.siteName} />
	<meta property="og:description" content={info.longDescription} />
	<meta property="og:image" content={info.logoPath} />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="tptp.vercel.app" />
	<!-- <meta property="twitter:url" content={window.location.hostname} /> -->
	<meta name="twitter:title" content={info.siteName} />
	<meta name="twitter:description" content={info.longDescription} />
	<meta name="twitter:image" content={info.logoPath} />
</svelte:head>
<section class="w-full py-[50px]">
	<div
		class="bg-primary-500 bg-bgGraph bg-cover bg-center w-full h-[600px] shadow-2xl grid grid-cols-1 content-center"
	>
		<center>
			<img
				class="z-1 top-[50px] left-[100px] w-[50vw] max-h-[380px] object-contain  self-end"
				src="/assets/general/logo.svg"
				alt="logo"
			/>
		</center>
		<div class="flex flex-col items-end p-10">
			<img
				class="z-1 w-[500px] text-white  ml-[100px] mt-[200px] mt-0"
				src="/assets/general/logo-text.svg"
				alt="logo"
			/>
			<p class="text-white text-xl">your sharing spot</p>
		</div>
	</div>
</section>

<!--
<section class="bg-stayYellow-600 h-full  text-white py-4 w-full">
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4 bg-black h-full md:text-2xl sm:text-xl font-bold">
		<div class="bg-primary-600 text-center py-4 w-auto uppercase">120 <br />reading hours</div>
		<div class="bg-primary-600 text-center py-4 w-auto uppercase">50<br />articles</div>
		<div class="bg-primary-600 text-center py-4 w-auto uppercase">15<br />topics</div>
		<div class="bg-primary-600 text-center py-4 w-auto uppercase">20<br />resources</div>
		<div class="bg-primary-600 text-center py-4 w-auto uppercase">200<br />active users</div>
		<div class="bg-primary-600 text-center py-4 w-auto uppercase">25<br />team members</div>
	</div>
</section>-->

<!--
<section class="bg-stayYellow-600 h-full  text-white pb-4">
	<div class="grid grid-cols-2 gap-4 bg-primary-600 h-[100px] uppercase">
		<div class="text-center md:text-xl sm:text-l font-bold text-stayYellow-600 py-4">
			Recent <br /> Articles
		</div>
		<div class="text-center md:text-xl sm:text-l font-bold py-4">
			Relevant <br /> Articles
		</div>
	</div>
</section>


<section class="bg-stayYellow-600 h-full  text-white pb-4">
	<div class="grid md:grid-cols-2 sm:grid-cols-1 bg-primary-600 uppercase no-padding m-0">
		<div class="self-center  text-center md:text-xl sm:text-l font-bold text-stayYellow-600 bg-themes max-h-[200px]">
				<img src="assets/general/bg-1.jpeg" class="w-full object-fill" alt="bg"  />
				<p class="text-left">Machine Learning Theory</p>

		</div>
		<div class="self-end  text-center md:text-xl sm:text-l font-bold text-stayYellow-600 bg-themes max-h-[200px]">
			<center>
				<img src="assets/general/bg-1.jpeg" class="w-full object-cover" alt="bg" />
				<p class="text-left">Natural Language Processing</p>
			</center>		
		</div>
	</div>
	<div class="grid md:grid-cols-2 sm:grid-cols-1 bg-primary-600 uppercase no-padding">
		<div class="self-end  text-center md:text-xl sm:text-l font-bold text-stayYellow-600 bg-themes max-h-[200px]">
			<center>
				<img src="assets/general/bg-1.jpeg" class="w-full object-cover" alt="bg" />
				<p class="text-left">Computer Vision</p>
			</center>
		</div>
		<div class="self-end  text-center md:text-xl sm:text-l font-bold text-stayYellow-600 bg-themes max-h-[200px]">
			<center>
				<img src="assets/general/bg-1.jpeg" class="w-full object-cover" alt="bg" />
				<p class="text-left">Edge AI</p>
			</center>		
		</div>
	</div>
</section>
-->
