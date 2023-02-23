<script lang="ts">
	import { Heading, P, Badge, Alert, Card, Button } from 'flowbite-svelte'
	import { InformationCircle } from 'svelte-heros-v2'
</script>

<header>
	<Heading tag="h2" customSize="text-4xl font-bold">
		Welcome to <span class="font-black text-primary-300">Author Panel</span>
		<Badge><span class="font-bold uppercase">Beta</span></Badge>
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
<main>
	<div class="flex space-x-8">
		<Card class="text-start border-0 bg-slate-50 w-full flex items-start" size="lg" padding="xl">
			<h5 class="mb-2 text-3xl font-bold text-slate-900">Your profile</h5>
			<p class="mb-5 text-base text-slate-500 sm:text-lg">
				Stay up to date and move work forward with Flowbite on iOS & Android. Download the app
				today.
			</p>
			<div class="justify-center items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
				<Button>See your profile</Button>
				<Button color="alternative">Edit profile</Button>
			</div>
		</Card>
		<Card class="text-start border-0 bg-slate-50 w-full flex items-start" size="lg" padding="xl">
			<h5 class="mb-2 text-3xl font-bold text-slate-900">Your articles</h5>
			<p class="mb-5 text-base text-slate-500 sm:text-lg">
				Stay up to date and move work forward with Flowbite on iOS & Android. Download the app
				today.
			</p>
			<div class="justify-center items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
				<Button>Write new article</Button>
				<Button color="alternative">See your articles</Button>
			</div>
		</Card>
	</div>
</main>
<Alert color="yellow">
	<span slot="icon">
		<InformationCircle variation="solid" />
	</span>
	You have 1 article in review
</Alert>
