<script lang='ts'>
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'

	import { slide } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'

	import type { ArticlesResponse } from '@lib/models'

	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'

	import {
		Button,
		Modal,
		Badge,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Tooltip,
		ListPlaceholder,
		Heading,
		P
	} from 'flowbite-svelte'
	import { PencilSquare, Window, CheckBadge, Trash, ExclamationCircle } from 'svelte-heros-v2'

	import api from '@lib/services'
	import dayjs from 'dayjs'

	const { addNotification } = getNotificationsContext()

	let popupModal = false
	let selectedArticle = null
	let loading = true
	let articles: ArticlesResponse

	const loadArticles = () => {
		api.articles.draft.fetch()
			.then(res => articles = res)
			.catch(err => addNotification(notify.error(err)))
			.finally(() => loading = false)
	}

	const handleDelete = () => {
		api.articles.delete(selectedArticle)
			.then(() => {
				loadArticles()
				addNotification(notify.success('The article has been deleted successfully'))
			})
			.catch(err => addNotification(notify.error(err)))
	}

	onMount(loadArticles)

	let searchTerm = ''

	$: filteredArticles = articles?.data.filter(
		(article) => article.attributes.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	)
</script>


<header>
	<Heading tag='h2' customSize='text-4xl font-extrabold'>
		Draft <span class='font-black text-primary-300'>articles</span>
	</Heading>
	<p class='my-4 text-slate-500'>
		Are you ready to write a new article? Setup main info and then you will be able to write!
	</p>
	<P class='mb-4'>
		Setup main info such as title, description, targte and topics. An article should have a unique
		slug, so choose a good title beacuse the slug will be automatically generated from it.
	</P>
</header>

{#if !loading}
	<TableSearch
		placeholder='Search by title'
		divClass='shadow-none'
		hoverable
		bind:inputValue={searchTerm}
	>
		<caption
			class='p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800'
		>
			Our products
			<p class='mt-1 text-sm font-normal text-gray-500 dark:text-gray-400'>
				Browse a list of Flowbite products designed to help you work and play, stay organized, get
				answers, keep in touch, grow your business, and more.
			</p>
		</caption>
		<TableHead>
			<TableHeadCell>Title</TableHeadCell>
			<TableHeadCell>Creation date</TableHeadCell>
			<TableHeadCell>Last update</TableHeadCell>
			<TableHeadCell>Target</TableHeadCell>
			<TableHeadCell>Actions</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each filteredArticles as article}
				<TableBodyRow class='hover:cursor-pointer'>
					<TableBodyCell>{article.attributes.title}</TableBodyCell>
					<TableBodyCell>{dayjs(article.attributes.createdAt).format('DD MMMM YYYY, HH:mm')}</TableBodyCell>
					<TableBodyCell>{dayjs(article.attributes.updatedAt).format('DD MMMM YYYY, HH:mm')}</TableBodyCell>
					<TableBodyCell>
						<Badge large color={
						article.attributes.target?.data?.id === 1 ? "blue"
						: (article.attributes.target?.data?.id === 2 ? "indigo" : "purple")}>
							{article.attributes.target?.data?.attributes?.label || 'null'}
						</Badge>
					</TableBodyCell
					>
					<TableBodyCell>
						<div class='flex items-center space-x-6'>
							<Window
								class='opacity-40 hover:opacity-100'
								on:click={() => goto(`/articles/draft/${article.attributes.slug}/preview`)}
							/>
							<Tooltip class='text-xs'>Preview</Tooltip>
							<PencilSquare
								class='opacity-40 hover:opacity-100'
								on:click={() => goto(`/articles/draft/${article.attributes.slug}/edit`)}
							/>
							<Tooltip class='text-xs'>Edit</Tooltip>
							<CheckBadge
								class='opacity-40 hover:opacity-100'
								on:click={() => goto(`/articles/draft/${article.attributes.slug}/editor`)}
							/>
							<Tooltip class='text-xs'>Publish</Tooltip>
							<Trash
								class='text-red-800 opacity-40 hover:opacity-100'
								on:click={() => {
									selectedArticle = article.id
									popupModal = true
								}}
							/>
							<Tooltip class='text-xs'>Delete</Tooltip>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
		<Modal
			transition={slide}
			params={{duration: 300, easing: quintOut}}
			bind:open={popupModal}
			size='xs'
			autoclose>
			<div class='text-center'>
				<ExclamationCircle class='mx-auto mb-4 w-14 h-14 text-red-300' />
				<h3 class='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
					Are you sure you want to delete this article?
				</h3>
				<Button color='red' class='mr-2' on:click={handleDelete}>Yes, I'm sure</Button>
				<Button color='alternative'>No, cancel</Button>
			</div>
		</Modal>
	</TableSearch>


{:else}
	<ListPlaceholder class='max-w-full' />
{/if}