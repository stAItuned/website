<script lang="ts">
	import info from '@lib/info'
	import { MetaTags, JsonLd } from 'svelte-meta-tags';
    import { ORGANIZATION_SCHEMA } from '@lib/seo'
    const pageTitle = "Home"
</script>

<MetaTags
    title={pageTitle}
    titleTemplate="%s | {info.siteName}"
    description={info.longDescription}
    canonical={info.basePath}
    openGraph={{
        site_name: info.siteName,
        type: "website",
        description: info.longDescription,
        title: pageTitle,
        images: [{url: info.logo.relPath}],
        url: info.basePath,
    }}
    twitter={{
        title: pageTitle,
        description: info.longDescription,
        cardType: "summary_large_image",
        site: info.basePath,
        image: info.logo.relPath,
    }}
/>

<JsonLd 
    output="head"
    schema={ORGANIZATION_SCHEMA}
/>