<script lang='ts'>
	import { sineIn } from 'svelte/easing'
	import dayjs from 'dayjs'

	import { actions, hasBeenPublishModalCalled, hasDeleteModalCalled, isLoadingNeeded } from './config'
	import type { ArticleAttributes, BaseData } from '@lib/models'
	import { SERVER_URL } from '@lib/services/config'

	import { ExclamationTriangle, InformationCircle, Photo } from 'svelte-heros-v2'
	import { Alert, Badge, Drawer, Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte'
	import { Modal } from '@protected/components'
	import api from '@lib/services'
	import { notify } from '@lib/hooks'
	import { getNotificationsContext } from 'svelte-notifications'

	export let hasActions: boolean = true
	export let hidden: boolean
	export let article: BaseData<ArticleAttributes>

	const url = article.attributes.cover?.data?.attributes.url
	const coverUrl = SERVER_URL + url
	const { addNotification } = getNotificationsContext()

	const handleDelete = () => {
		api.articles.delete(article.id)
			.then(() => {
				isLoadingNeeded.set(true)
				addNotification(notify.success('The article has been deleted successfully'))
			})
			.catch(err => addNotification(notify.error(err)))
	}

	const handlePublish = () => {
		api.articles.draft.makeReviewable(article.id)
			.then(() => {
				isLoadingNeeded.set(true)
				addNotification(notify.success('Great! Your article has been sent in review!'))
			})
			.catch(err => addNotification(notify.error(err)))
	}

	let transitionParamsRight = {
		x: 320,
		duration: 200,
		easing: sineIn
	}
</script>

<Drawer
	backdrop={false}
	placement='right'
	transitionType='fly'
	transitionParams={transitionParamsRight}
	bind:hidden
	class='shadow-xl !w-10/12 sm:!w-2/3 md:!w-1/2 lg:!w-1/3 xl:!w-1/4 !p-8'>
	<div class='flex flex-col space-y-6 h-56'>
		<!-- Cover Image -->
		{#if url}
			<img
				src={coverUrl}
				alt='cover image'
				class='w-full h-56 object-cover rounded-lg' />
		{:else}
			<div class='flex bg-slate-100 w-full h-full justify-center items-center p-8'>
				<Photo size='64' class='opacity-50 text-slate-400' />
			</div>
		{/if}

		<!--Header -->
		<div>
			<h4 class='mb-4 text-lg font-semibold text-slate-700'>
				{article.attributes.title}
			</h4>
			<p class='text-xs mb-4'>{article.attributes.description}</p>
			<small>
				Created at {dayjs(article.attributes.createdAt).format("dddd DD MMMM YYYY, HH:mm")} <br />
				Updated at {dayjs(article.attributes.updatedAt).format("dddd DD MMMM YYYY, HH:mm")}
			</small>
		</div>

		<!-- Main info -->
		<div class='space-y-1.5'>
			<h5 class='mb-4 text-base font-semibold text-slate-600'>More details</h5>
			<p>
				This article is intended for
				<Badge color={
							article.attributes.target?.data?.id === 1 ? "blue"
							: (article.attributes.target?.data?.id === 2 ? "indigo" : "purple")}>
					{article.attributes.target?.data?.attributes?.label || 'null'}
				</Badge>
			</p>
			<p>
				{#if article.attributes.readingTime}
					Your article is {article.attributes.readingTime} long
				{:else }
					Your article has no content yet
				{/if}
			</p>
			<div class='py-3'>
				<h6 class='text-sm font-semibold text-slate-600 mb-3'>Tags</h6>
				<div class='flex flex-wrap gap-2'>
					{#each article.attributes.topics.data as topic}
						<Badge color='indigo'>
							{topic.attributes.label}
						</Badge>
					{/each}
				</div>
			</div>
		</div>

		{#if hasActions}
			<!-- Actions -->
			<div>
				<Sidebar class='!w-full !pb-6'>
					<SidebarWrapper divClass='overflow-y-auto'>
						<SidebarGroup border>
							{#each actions(article) as action}
								<SidebarItem label={action.label} href={action?.href} on:click={action?.callback}
														 class='text-slate-600'>
									<svelte:fragment slot='icon'>
										<svelte:component this={action.icon} />
									</svelte:fragment>
								</SidebarItem>
							{/each}
						</SidebarGroup>
					</SidebarWrapper>
				</Sidebar>


				<Modal bind:open={$hasDeleteModalCalled} variant='danger' callback={handleDelete}
							 on:hide={() => $hasDeleteModalCalled = false}>
					<h3 class='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
						Are you sure you want to delete this article?
					</h3>
				</Modal>


				<Modal size='md' bind:open={$hasBeenPublishModalCalled} variant='warning' callback={handlePublish}
							 on:hide={() => $hasBeenPublishModalCalled = false}>
					<h3 class='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
						Are you sure you want to publish this article?
					</h3>
					<Alert color='yellow' class='mb-6 text-left'>
    			<span slot='icon'>
						<ExclamationTriangle variation='solid' />
    			</span>
						<p>
							Please keep in mind that by confirming you will send your article to review and it will no longer be
							editable.
						</p>
					</Alert>
					<Alert class='mb-6 text-left'>
					<span slot='icon'>
						<InformationCircle variation='solid' />
					</span>
						<p>
							You will always be able to check the status of your article within
							<a href='/articles/in-review'
								 class='font-semibold underline hover:text-blue-800 dark:hover:text-blue-900'>
								articles in review
							</a> page.
						</p>
					</Alert>
				</Modal>


			</div>
		{/if}
	</div>
</Drawer>


