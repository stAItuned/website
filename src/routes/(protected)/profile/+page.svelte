<script lang="ts">
	import { Heading, P, Avatar } from 'flowbite-svelte'

	import { user } from '@lib/stores'
</script>

<header>
	<Heading tag="h2" customSize="text-4xl font-bold">
		Welcome to <span class="font-black text-primary-300">your profile</span>
	</Heading>
	<p class="my-4 text-slate-500">
		Write, edit and publish from here. You can also see your profile and set your overview.
	</p>
	<P class="mb-4">
		This panel was developed to help you managing your profile and your articles. You can see some
		analysis based on your created content and you can write your articles here. Then a reviewer
		will check what you do and your article will be published! So smart!
	</P>
</header>
<main class="flex flex-col space-y-8">
	<div class="flex items-center space-x-6">
		<Avatar class="w-32 h-32">{`${$user?.firstname.at(0)}${$user?.lastname.at(0)}`}</Avatar>
		<div class="flex flex-col space-y-2">
			<div>
				<h5 class="text-3xl font-semibold text-slate-800">
					{`${$user?.firstname} ${$user?.lastname}`}
				</h5>
				<p class="text-slate-600">Full Stack Developer</p>
			</div>
			<p class="text-sm w-2/3 text-slate-400">
				I am a Machine Learning Engineer amazed by the research world and strongly interested in
				Computer Vision and Natural Language Processing.
			</p>
		</div>
	</div>
    <div class="bg-slate-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold text-slate-700">Published articles</h3>
    </div>
</main>
