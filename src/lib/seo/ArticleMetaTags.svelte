<script lang="ts">
	import info from '@lib/info'
	import { MetaTags, JsonLd } from 'svelte-meta-tags'
	import { articleSchema } from '@lib/seo'
	import type { Article } from '@lib/interfaces'
	import BreadcrumbsMetaTags from './BreadcrumbsMetaTags.svelte'
	export let article: Article
	const pageTitle = article.metadata.title
	const pageDescription = article.metadata.meta
</script>

<MetaTags
	title={pageTitle}
	titleTemplate={`%s | ${info.siteName}`}
	description={pageDescription}
	canonical={`${info.basePath}/learn/${article.metadata.target.toLowerCase()}/${article.slug}`}
	openGraph={{
		site_name: info.siteName,
		type: 'article',
		description: pageDescription,
		title: pageTitle,
		images: [{ url: article.metadata.cover }],
		url: info.basePath,
		article: {
			publishedTime: article.metadata.date,
			authors: [article.metadata.author],
			tags: article.metadata.topics
		}
	}}
	twitter={{
		title: pageTitle,
		description: pageDescription,
		cardType: 'summary_large_image',
		site: info.basePath,
		image: article.metadata.cover
	}}
/>

<JsonLd output="head" schema={articleSchema(article)} />

<BreadcrumbsMetaTags
	pages={[
		{title: info.siteName, path: '/'},
		{ title: 'Learn', path: '/learn' },
		{ title: article.metadata.target, path: `/learn/${article.metadata.target.toLowerCase()}` },
		{
			title: article.metadata.title,
			path: `/learn/${article.metadata.target.toLowerCase()}/${article.slug}`
		}
	]}
/>
