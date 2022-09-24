<script lang="ts">
    import { TeamCard } from '@features/blog/index'

    import type { Author } from '@lib/git/types'
    import type { PageData } from '.svelte-kit/types/src/routes/meet/[slug]/$types'

    import { page } from '$app/stores';

    export let data: PageData
	const authors: Author[] = data.authors

    let slug = $page.url.pathname.split("/")[2]
    const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);

    

    const filterAuthors = authors.filter(author => author.team.indexOf(capitalizedSlug) > -1)



</script>


<div class="min-h-screen">

    <h1 class="text-bold text-5xl m-auto mt-20 w-max mb-20 uppercase">{capitalizedSlug} team</h1>

    <div class="px-4 flex flex-wrap justify-center m-20">

        {#each filterAuthors as author}
            <TeamCard  {author} />
        {/each}

    </div>

</div>
