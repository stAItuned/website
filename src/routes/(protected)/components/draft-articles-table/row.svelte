<script lang='ts'>
	import dayjs from 'dayjs'
	import type { ArticleAttributes, BaseData } from '@lib/models'

	import { Badge, TableBodyCell, TableBodyRow } from 'flowbite-svelte'
	import { Actions } from '@protected/components/draft-articles-table'

	export let article: BaseData<ArticleAttributes>

	let hiddenActions = true
	const openActions = () => hiddenActions = false

	const badgeColor = article.attributes.target?.data?.id === 1 ?
		'blue' : (article.attributes.target?.data?.id === 2 ?
			'indigo' : 'purple')
</script>

<TableBodyRow class='hover:cursor-pointer' on:click={openActions}>
	<TableBodyCell>{article.attributes.title}</TableBodyCell>
	<TableBodyCell>{dayjs(article.attributes.updatedAt).format('DD MMMM YYYY, HH:mm')}</TableBodyCell>
	<TableBodyCell>{dayjs(article.attributes.createdAt).format('DD MMMM YYYY, HH:mm')}</TableBodyCell>
	<TableBodyCell>
		<Badge large color={badgeColor}>
			{article.attributes.target?.data?.attributes?.label}
		</Badge>
	</TableBodyCell>
	<Actions bind:hidden={hiddenActions} {article} />
</TableBodyRow>