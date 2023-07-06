<script lang='ts'>
	import { goto } from '$app/navigation'

	import dayjs from 'dayjs'
	import type { ArticleResponse } from '@lib/models'

	import { ArrowRight, Clock, CodeBracket, PencilSquare } from 'svelte-heros-v2'
	import { Badge, Toolbar, ToolbarButton, ToolbarGroup } from 'flowbite-svelte'

	export let article: ArticleResponse
</script>

<div class='bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-4 w-2/3'>
	<div class=' items-center justify-between'>
		<small class='uppercase tracking-widest'>Your last draft article</small>
	</div>
	<div>
		<h5 class='text-2xl font-semibold'>{article.data.attributes.title}</h5>
		<p class='text-slate-500 my-3'>{article.data.attributes.description}</p>
		<Toolbar slot='footer' embedded>
			<ToolbarGroup>
				<Badge border class='mr-3'>
					<Clock variation='solid' size='16' class='mr-2' />
					last update {dayjs(article.data.attributes.updatedAt).format('DD MMMM YYYY, HH:mm')}
				</Badge>
				<ToolbarButton
					on:click={() => goto(`/articles/draft/${article.data.attributes.slug}/edit`)}
				>
					<div class='flex space-x-2 items-center px-1.5'>
						<PencilSquare />
						<span>Edit info</span>
					</div>
				</ToolbarButton>
				<ToolbarButton
					on:click={() => goto(`/articles/draft/${article.data.attributes.slug}/editor`)}
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