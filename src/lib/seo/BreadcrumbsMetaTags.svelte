<script lang="ts">
	import { JsonLd } from "svelte-meta-tags"
	import { breadcrumbSchema } from "."

    export let pages: { title: string; path: string }[];
</script>

<JsonLd output="head" schema={breadcrumbSchema(pages)} />