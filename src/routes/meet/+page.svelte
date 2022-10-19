<script lang="ts">
	import techLogo from '../../assets/team/tech_large.svg'
	import marketingLogo from '../../assets/team/marketing_large.svg'
	import writersLogo from '../../assets/team/writers_large.svg'

	import { Button } from '@features/ui-core'
</script>

<div class="max-w-7xl mx-auto mb-16 mt-[150px] px-8 space-y-24">
	<section class="md:text-lg space-y-8">
		<div class="space-y-1">
			<p class="text-primary-600 font-bold m-0 mb-1 text-2xl">
				Have you always wanted to exchange opinions about AI practical applications?
			</p>
			<p>Then you’re in the right place.</p>
		</div>

		<div class="space-y-2">
			<p>
				In January 2022, after years of university spent wishing to find a space for sharing ideas,
				we wondered if it was the right time for us to create an AI community to share knowledge. As
				a consequence, stAI tuned was created: an open community in which everyone can share their
				knowledge, research projects and insights related to the AI topic.
			</p>
			<p>
				After the beginning of the project we realized that it’s very common to hear conversations
				about Artificial Intelligence in many contexts, like work, television, with friends and so
				on.
			</p>
		</div>
		<div class="space-y-1">
			<p class="font-bold text-primary-600 text-2xl m-0">
				But how many people do actually know what Artificial Intelligence is? And how many are
				familiar with its possible applications?
			</p>
			<p>Hence the idea to make everyone aware of AI potentialities in real life.</p>
		</div>
	</section>

	<!-- roadmap !! -->

	<section class="space-y-16">
		<h1 class="text-6xl font-bold text-primary-600 text-center uppercase">Our team</h1>
		<div class="flex flex-col flex-wrap gap-8 md:flex-row justify-between">
			<a href="/meet/tech">
				<div class="flex flex-col py-8 px-16 bg-gray-100 rounded-lg shadow-lg space-y-6">
					<img src={techLogo} class="h-48" alt="tech" />
					<Button variant="primary" rounded="full" width="full">
						<span class="font-semibold text-2xl uppercase">Tech</span>
					</Button>
				</div>
			</a>
			<a href="/meet/marketing" class="">
				<div class="flex flex-col py-8 px-16 bg-gray-100 rounded-lg shadow-lg space-y-6">
					<img src={marketingLogo} class="h-48" alt="tech" />
					<div
						class="p-4 text-center bg-primary-600 hover:bg-primary-500 active:bg-primary-600 transition w-full text-white rounded-full"
					>
						<span class="font-semibold text-2xl uppercase">Marketing</span>
					</div>
				</div>
			</a>
			<a href="/meet/writers" class="">
				<div class="flex flex-col py-8 px-16 bg-gray-100 rounded-lg shadow-lg space-y-6">
					<img src={writersLogo} class="h-48" alt="tech" />
					<div
						class="p-4 text-center bg-primary-600 hover:bg-primary-500 active:bg-primary-600 transition w-full text-white rounded-full"
					>
						<span class="font-semibold text-2xl uppercase">Writers</span>
					</div>
				</div>
			</a>
		</div>
	</section>
</div>

<!--
<section class="items-center ">
    <center>
        <div class="sm:w-6/6 md:w-5/6 lg:w-4/6 bg-primary-500 bg-bgGraph bg-cover bg-center rounded-3xl">
            <img src="assets/mission/Ai logo.svg" alt="logo" class="top-[50px] left-[100px] w-[50vw] max-h-[380px] object-contain  self-end"/>

            <div class="flex flex-col items-end p-10">
                <img
                    class="z-1 w-[500px] text-white  ml-[100px] mt-[200px] mt-0"
                    src="/assets/general/logo-text.svg"
                    alt="logo"
                />
                <p class="text-white text-xl">your sharing spot</p>
            </div>
        </div>
        
    </center>
</section> -->
