<script lang="ts">
	import info from "@lib/info"
	import { MetaTags } from "svelte-meta-tags"
	import BreadcrumbsMetaTags from "./BreadcrumbsMetaTags.svelte"

    export let pageTitle: string;
    export let pageDescription: string;
    export let pagePath: string;

</script>

<MetaTags
    title={pageTitle}
    titleTemplate={`%s | ${info.siteName}`}
    description={pageDescription}
    canonical={`${info.basePath}${pagePath}`}
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

<BreadcrumbsMetaTags
    pages={[
        { title: info.siteName, path: '/' },
        { title: pageTitle, path: pagePath }
    ]}
/>