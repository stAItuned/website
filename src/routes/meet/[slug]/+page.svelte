<script lang="ts">
    import { TeamCard } from '@features/blog/index'

    import type { Author } from '@lib/git/types'
    import type { PageData } from '.svelte-kit/types/src/routes/meet/[slug]/$types'

    import { page } from '$app/stores';

    export let data: PageData
	const authors: Author[] = data.authors

    let slug = $page.url.pathname.split("/")[2]
    const capitalizedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);

    let filterAuthors = authors.filter(author => author.team.indexOf(capitalizedSlug) > -1)


    // clean this part and add it on an external file? 
    const techOrder = ['Daniele Moltisanti','Francesco Di Salvo','Davide Nardini','Alex Buffa','Francesco Di Gangi']
    const marketingOrder = ['Roberta Ghidini','Alessandra Lo Chirco', 'Alice Ghidini', 'Davide Scurto',
                            'Emanuele Migliore', 'Francesca Cancelliere', 'Gerarda Malanga','Sofia Pedrini',
                            'Valeria Tardio']
    let order: string[] = []

    if (capitalizedSlug == 'Tech') {
        order = techOrder
    } else if (capitalizedSlug == 'Marketing') {
        order = marketingOrder
    }
    
    if (capitalizedSlug == 'Tech' || capitalizedSlug == 'Marketing') {
        let arr: Author[] = [];
        
        // iterate in order to fill the new array
        for (let i = 0; i < order.length; i++) {
            // iterate the current array in order to match the relative team member
            for(let j = 0; j < filterAuthors.length; j++) {
                if (filterAuthors[j].name == order[i]) {
                    arr.push(filterAuthors[j])
                }
            }
        }
        filterAuthors = arr
    } else {
        let arr: Author[] = [];

        console.log(filterAuthors[0])

        /*filterAuthors.sort((a,b) => 
            a.articles.reduce((total, curr)=>total+curr.metadata.readingTime, 0) >= 
            b.articles.reduce((total, curr)=>total+curr.metadata.readingTime, 0))*/

    }

</script>


<div class="min-h-screen">

    <h1 class="text-bold text-5xl m-auto mt-20 w-max mb-20 uppercase">{capitalizedSlug} team</h1>

    <center>
    <div class="px-4 justify-center m-20 
                grid 
                sm:grid-cols-1 
                md:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-5">


        {#each filterAuthors as author}
            <div class="justify-self-center">
                <TeamCard  {author} />
            </div>
        {/each}

    </div>
    </center>

</div>
