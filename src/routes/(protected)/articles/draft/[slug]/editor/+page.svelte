<script lang='ts'>
	import type { PageData } from './$types'
	import {
		Heading,
		P,
		Avatar,
		Button,
		Badge,
		Toolbar,
		ToolbarGroup,
		ToolbarButton
	} from 'flowbite-svelte'
	import { Clock, CloudArrowUp, CheckBadge } from 'svelte-heros-v2'
	import { Editor } from 'bytemd'
	import dayjs from 'dayjs'
	import api from '@lib/services'
	import type { ArticleResponse } from '@lib/models'
	import { notify } from '@lib/hooks'
	import { getNotificationsContext } from 'svelte-notifications'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'

	const { addNotification } = getNotificationsContext()

	let loading = true
	let article: ArticleResponse
	let content
	let updatedAt
	let lastSavedContent

	const slug = $page.params.slug

	onMount(() => {
		api.articles.draft.fetchBySlug(slug)
			.then(res => {
				article = res
				lastSavedContent = content = article.data?.attributes.content
				updatedAt = article.data?.attributes.updatedAt
			})
			.catch((err) => addNotification(notify.error(err)))
			.finally(() => loading = false)
	})

	const handleSave = () => {
		if (content !== lastSavedContent)
			api.articles
				.updateContent(article.data.id, content)
				.then((res) => {
					addNotification(notify.success('Your article has been saved successfully'))
					lastSavedContent = res.data.attributes.content
					updatedAt = res.data.attributes.updatedAt
				})
				.catch((err) => addNotification(notify.error(err)))
	}

	const handlePublish = () => {
		handleSave()
		api.articles.draft.makeReviewable(article.data.id)
			.then(() => {
				// TODO: Redirect the user somewhere
				addNotification(
					notify.success('Great! Your article is ready to be published and a reviewer will take it over as soon as possible!')
				)
			})
			.catch((err) => addNotification(notify.error(err)))
	}

	setInterval(handleSave, 30 * 1000)
</script>

{#if !loading}
	<Toolbar slot='header' embedded>
		<ToolbarGroup>
			<Badge border class='mr-3'>
				<Clock variation='solid' size='16' class='mr-2' />
				last update {dayjs(updatedAt).format('DD MMMM YYYY, HH:mm')}
			</Badge>
			<ToolbarButton on:click={handleSave}
										 class={`${lastSavedContent === content ? "opacity-25 hover:bg-inherit text-inherit" : "opacity-100"}`}
										 disabled={lastSavedContent === content}>
				<div class='flex space-x-2 items-center px-1.5'>
					<CloudArrowUp />
					<span>Save</span>
				</div>
			</ToolbarButton>
			<ToolbarButton on:click={handlePublish}>
				<div class='flex space-x-2 items-center px-1.5'>
					<CheckBadge />
					<span>Publish</span>
				</div>
			</ToolbarButton>
		</ToolbarGroup>
	</Toolbar>

	<header>
		<Heading tag='h2' customSize='text-4xl font-extrabold'>
			{article.data.attributes.title}
		</Heading>
		<p class='my-4 text-slate-500'>
			{article.data.attributes.description}
		</p>

		<div class='flex w-full justify-between items-center'>
			<div class='flex items-center space-x-2'>
				<Avatar>AD</Avatar>
				<span
				>{`${article.data.attributes.author?.data.attributes.firstname} ${article.data.attributes.author?.data.attributes.lastname}`}</span
				>
			</div>
			<span>{article.data.attributes.target?.data.attributes.label}</span>
		</div>
	</header>

	<Editor class='bytemd' value={content} on:change={(e) => (content = e.detail.value)} />
{/if}