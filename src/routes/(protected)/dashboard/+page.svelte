<script lang='ts'>
	import type { PageData } from './$types'

	import { onMount } from 'svelte'
	import {
		Heading,
		P,
		Badge,
		Alert,
		Card,
		Button,
		Toolbar,
		ToolbarGroup,
		ToolbarButton
	} from 'flowbite-svelte'
	import {
		InformationCircle,
		ArrowRight,
		Clock,
		PencilSquare,
		CodeBracket,
		PlusCircle
	} from 'svelte-heros-v2'

	import { Pie } from 'svelte-chartjs'
	import 'chart.js/auto'
	import dayjs from 'dayjs'
	import type { ArticleResponse, ErrorResponse } from '@lib/models'
	import { goto } from '$app/navigation'
	import api from '@lib/services'
	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'

	const { addNotification } = getNotificationsContext()

	let loading = true
	let lastDraft: ArticleResponse

	onMount(() => {
		api.articles.draft.last()
			.then(res => lastDraft = res)
			.catch(err => addNotification(notify.error(err)))
			.finally(() => loading = false)
	})


	const dataPie = {
		labels: ['Published', 'Draft', 'Reviewing'],
		datasets: [
			{
				data: [2, 5, 1]
			}
		]
	}
</script>

{#if !loading}
	<header>
		<Heading tag='h2' customSize='text-4xl font-bold'>
			Welcome to <span class='font-black text-primary-300'>Author Panel</span>
			<Badge><span class='font-bold uppercase'>Beta</span></Badge>
		</Heading>
		<p class='my-4 text-slate-500'>
			Write, edit and publish from here. You can also see your profile and set your overview.
		</p>
		<P class='mb-4'>
			This panel was developed to help you managing your profile and your articles. You can see some
			analysis based on your created content and you can write your articles here. Then a reviewer
			will check what you do and your article will be published! So smart!
		</P>
	</header>
	<main class='flex flex-col space-y-8'>
		<div class='flex space-x-8'>
			<div class='bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-4 w-2/3'>
				<div class=' items-center justify-between'>
					<small class='uppercase tracking-widest'>Your last draft article</small>
					<a href='/articles/draft' class='flex items-center text-sm text-slate-500'>
						See all your draft
						<ArrowRight size='16' class='ml-2' />
					</a>
				</div>
				<div>
					<h5 class='text-2xl font-semibold'>{lastDraft.data.attributes.title}</h5>
					<p class='text-slate-500 my-3'>{lastDraft.data.attributes.description}</p>
					<Toolbar slot='footer' embedded>
						<ToolbarGroup>
							<Badge border class='mr-3'>
								<Clock variation='solid' size='16' class='mr-2' />
								last update {dayjs(lastDraft.data.attributes.updatedAt).format('DD MMMM YYYY, HH:mm')}
							</Badge>
							<ToolbarButton
								on:click={() => goto(`/articles/draft/${lastDraft.data.attributes.slug}/edit`)}
							>
								<div class='flex space-x-2 items-center px-1.5'>
									<PencilSquare />
									<span>Edit info</span>
								</div>
							</ToolbarButton>
							<ToolbarButton
								on:click={() => goto(`/articles/draft/${lastDraft.data.attributes.slug}/editor`)}
							>
								<div class='flex space-x-2 items-center px-1.5'>
									<CodeBracket />
									<span>Open editor</span>
								</div>
							</ToolbarButton>
						</ToolbarGroup>
					</Toolbar>
				</div>
			</div>
			<div
				on:click={() => goto('/articles/new')}
				class='relative w-1/3 text-slate-50 bg-gradient-to-br from-purple-400 to-sky-400 border border-slate-200 p-4 rounded-lg hover:cursor-pointer hover:scale-105 transition'
			>
				<div class='mt-4 ml-4'>
					<h5 class='text-4xl font-bold leading-none'>Let's create <br /> a new article</h5>
					<p class='mt-3'>What are you waiting for? Let's start sharing your ideas!</p>
				</div>
				<PlusCircle size='128' class='absolute bottom-0 right-0 opacity-60' variation='solid' />
			</div>
		</div>
		<!-- <div class="flex space-x-8">
			<div class="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-4 w-2/3">
				<div class=" items-center justify-between">
					<small class="uppercase tracking-widest">Your last published article</small>
					<a href="/articles/published" class="flex items-center text-sm text-slate-500">
						See all your published articles
						<ArrowRight size="16" class="ml-2" />
					</a>
				</div>
				<div>
					<h5 class="text-2xl font-semibold">{lastDraft.data.attributes.title}</h5>
					<p class="text-slate-500 my-3">{lastDraft.data.attributes.description}</p>
					<Badge border class="mr-3" color="green">
						<Clock variation="solid" size="16" class="mr-2" />
						published at {dayjs(lastDraft.data.attributes.updatedAt).format('DD MMMM YYYY, HH:mm')}
					</Badge>
					<div class="bg-slate-100 border border-slate-200 p-4 text-center mt-4 rounded-lg">
						<h3 class="text-slate-400 font-semibold">Stats coming soon...</h3>
					</div>
				</div>
			</div>
			<div
				on:click={() => goto('/articles/new')}
				class="relative w-1/3 text-slate-50 bg-gradient-to-br from-purple-400 to-sky-400 border border-slate-200 p-4 rounded-lg hover:cursor-pointer hover:scale-105 transition"
			>
				<div class="mt-4 ml-4">
					<h5 class="text-4xl font-bold leading-none">Let's create <br /> a new article</h5>
					<p class="mt-3">What are you waiting for? Let's start sharing your ideas!</p>
				</div>
				<PlusCircle size="128" class="absolute bottom-0 right-0 opacity-60" variation="solid" />
			</div>
		</div> -->
		<!-- <div class="w-1/4 mb-8">
		<Pie data={dataPie} options={{ responsive: true }} />
	</div>
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
	</div> -->
	</main>
	<!-- <Alert color="yellow">
	<span slot="icon">
		<InformationCircle variation="solid" />
	</span>
	You have 1 article in review
</Alert> -->
{/if}
