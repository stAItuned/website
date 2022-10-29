<script lang="ts">
	import info from '@lib/info'
	import { JsonLd, MetaTags } from 'svelte-meta-tags'
	import { ORGANIZATION_SCHEMA } from '.'
	import BreadcrumbsMetaTags from './BreadcrumbsMetaTags.svelte'
	const pageTitle = 'Learn'
	const pageDescription = info.longDescription
</script>

<MetaTags
	canonical={`${info.basePath}/learn`}
	description={pageDescription}
	openGraph={{
		site_name: info.siteName,
		type: 'website',
		description: pageDescription,
		title: pageTitle,
		images: [{ url: info.logo.relPath }],
		url: info.basePath
	}}
	title={pageTitle}
	titleTemplate="%s | {info.siteName}"
	twitter={{
		title: pageTitle,
		description: pageDescription,
		cardType: 'summary_large_image',
		site: info.basePath,
		image: info.logo.relPath
	}}
/>

<JsonLd
	output="head"
	schema={{
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				item: {
					'@id': `${info.basePath}/learn/newbie`,
					name: 'Newbie'
				}
			},
			{
				'@type': 'ListItem',
				position: 2,
				item: {
					'@id': `${info.basePath}/learn/expert`,
					name: 'Expert'
				}
			}
		]
	}}
/>

<BreadcrumbsMetaTags
	pages={[
		{ title: 'Home', path: '/' },
		{ title: 'Learn', path: '/learn' }
	]}
/>
