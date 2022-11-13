<script lang="ts">
	import info from '@lib/info'
	import { MetaTags, JsonLd } from 'svelte-meta-tags'
	import { ORGANIZATION_SCHEMA } from '@lib/seo'
	const pageTitle = info.siteName
</script>

<MetaTags
	title={pageTitle}
	titleTemplate=""
	description={info.longDescription}
	canonical={info.basePath}
	openGraph={{
		site_name: info.siteName,
		type: 'website',
		description: info.longDescription,
		title: pageTitle,
		images: [{ url: info.logo.relPath }],
		url: info.basePath
	}}
	twitter={{
		title: pageTitle,
		description: info.longDescription,
		cardType: 'summary_large_image',
		site: info.basePath,
		image: info.logo.relPath
	}}
	additionalLinkTags={[{ rel: 'alternate', href: '/feed.xml', type: 'application/rss+xml' }]}
/>

<JsonLd output="head" schema={ORGANIZATION_SCHEMA} />

<h1 class="hidden">{pageTitle}</h1>
<p class="hidden">{info.longDescription}</p>