<script lang='ts'>
	import { Avatar, Button, ButtonGroup, Toolbar, ToolbarButton, ToolbarGroup } from 'flowbite-svelte'

	import { user } from '@lib/stores'
	import { CodeBracket, Envelope, PencilSquare } from 'svelte-heros-v2'
	import LinkedIn from '@shared/components/ui-core/icons/brands/linkedin.svelte'
	import { get } from 'svelte/store'
	import { SERVER_URL } from '@lib/services/config'
	import { marked } from 'marked'
	import { onMount } from 'svelte'
	import type { ArticlesResponse } from '@lib/models'
	import { getNotificationsContext } from 'svelte-notifications'
	import api from '@lib/services'
	import { notify } from '@lib/hooks'

	import Post from '@shared/components/features/post-new.svelte'

	type Tab = 'OVERVIEW' | 'ARTICLES'

	const { addNotification } = getNotificationsContext()
	const profile = get(user)?.author

	let loading = true
	let articles: ArticlesResponse
	let activeTab: Tab = 'OVERVIEW'

	const handleChangeTab = (tab: Tab) => activeTab = tab

	onMount(() => {
		api.articles.published.fetch()
			.then(res => articles = res)
			.catch((err) => addNotification(notify.error(err)))
			.finally(() => loading = false)
	})
</script>


<Toolbar slot='header' embedded>
	<ToolbarGroup>
		<a href='/profile/edit'>
			<ToolbarButton>
				<div class='flex space-x-2 items-center px-1.5'>
					<PencilSquare />
					<span>Edit Profile</span>
				</div>
			</ToolbarButton>
		</a>
		<a href='/profile/edit/overview'>
			<ToolbarButton>
				<div class='flex space-x-2 items-center px-1.5'>
					<CodeBracket />
					<span>Edit Overview</span>
				</div>
			</ToolbarButton>
		</a>
	</ToolbarGroup>
</Toolbar>

<main class='flex flex-col space-y-8 pt-8'>
	<div class='flex flex-col text-center gap-8'>

		<div class='flex flex-col text-center lg:text-start gap-y-8'>
			<div class='flex flex-col lg:flex-row items-center gap-8'>
				<div>
					{#if profile.avatar}
						<Avatar src={SERVER_URL + profile.avatar.url} class='w-32 h-32' />
					{:else}
						<Avatar class='w-32 h-32'>
							{`${profile.firstname.at(0)}${profile.lastname.at(0)}`}
						</Avatar>
					{/if}
				</div>
				<div class='flex flex-col space-y-3'>
					<div class='flex flex-col space-y-1'>
						<h2 tag='h2' class='text-5xl font-bold'>
							{profile.firstname} <span class='font-black text-blue-600'>{profile.lastname}</span>
						</h2>

						{#if profile.job}
							<p class='text-slate-600'>{profile.job}</p>
						{/if}

					</div>
					<div class='flex items-center justify-center lg:justify-start space-x-2'>
						{#if $user.author.linkedin}
							<a href={`https://linkedin.com/in/${profile.linkedin}`} target='_blank'
								 class='bg-sky-600 rounded-full p-1.5'>
								<LinkedIn class='w-4 h-4 text-slate-50' />
							</a>
						{/if}
						<a href={`mailto:${$user.email}`} class='bg-slate-800 rounded-full p-1.5'>
							<Envelope class='w-4 h-4 text-slate-50' variation='solid' />
						</a>
					</div>
				</div>
			</div>
			{#if profile.bio}
				<div class='bg-slate-50 p-6 rounded-lg w-full'>
					<p class='text-sm text-slate-600'>{profile.bio}</p>
				</div>
			{/if}
		</div>


		<div class='w-full mt-6'>
			<ButtonGroup class='w-full' size='lg'>
				<Button
					shadow={activeTab === "OVERVIEW" && "blue"}
					gradient
					color={activeTab === "OVERVIEW" && "blue"}
					class='w-1/2'
					on:click={() => handleChangeTab("OVERVIEW")}>Overview
				</Button>
				<Button
					shadow={activeTab === "ARTICLES" && "blue"}
					gradient
					color={activeTab === "ARTICLES" && "blue"}
					class='w-1/2'
					on:click={() => handleChangeTab("ARTICLES")}>Published articles
				</Button>
			</ButtonGroup>
		</div>

		<div>
			{#if activeTab === "OVERVIEW"}
				{#if profile.bio}
					<article class='prose prose-sm max-w-none text-sm my-8'>
						<div class='bg-slate-50 border border-slate-200 px-6 py-12 rounded-lg w-full'>
							{@html marked(profile.overview)}
						</div>
					</article>
				{:else}
					<p class='my-8 text-slate-500'>No overview here...</p>
				{/if}
			{:else}
				{#if !loading}
					{#if articles.data.length}
						{#each articles.data as article}
							<div class='flex flex-wrap my-8'>
								<Post {article} />
							</div>
						{/each}
					{:else}
						<p class='my-8 text-slate-500'>No published articles here...</p>
					{/if}
				{/if}
			{/if}
		</div>
	</div>
</main>
