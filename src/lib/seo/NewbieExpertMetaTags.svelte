<script lang="ts">
	import info from '@lib/info'
	import { MetaTags, JsonLd } from 'svelte-meta-tags'
	import { listArticleSchema } from '@lib/seo'
	import type { Article } from '@lib/interfaces'
	import type { Filters } from '@lib/configs'
	import BreadcrumbsMetaTags from './BreadcrumbsMetaTags.svelte'
	export let filteredArticles: Article[]
	export let target: typeof Filters.TARGETS[number]
	const pageTitle = target + ' - Learn'
	const pageDescription = info.longDescription // TODO: Change description for Learn Page
</script>

<MetaTags
	title={pageTitle}
	titleTemplate="%s | {info.siteName}"
	description={pageDescription}
	canonical={`${info.basePath}/learn/${target.toLowerCase()}`}
	openGraph={{
		site_name: info.siteName,
		type: 'website',
		description: pageDescription,
		title: pageTitle,
		images: [{ url: info.logo.relPath }],
		url: info.basePath
	}}
	twitter={{
		title: pageTitle,
		description: pageDescription,
		cardType: 'summary_large_image',
		site: info.basePath,
		image: info.logo.relPath
	}}
/>

<JsonLd output="head" schema={listArticleSchema(filteredArticles)} />

<BreadcrumbsMetaTags
	pages={[
		{ title: info.siteName, path: '/' },
		{ title: 'Learn', path: '/learn' },
		{ title: target, path: `/learn/${target.toLowerCase()}` }
	]}
/>
