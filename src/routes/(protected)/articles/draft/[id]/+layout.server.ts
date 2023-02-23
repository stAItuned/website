import api from "@lib/services";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }: { params: { id: number } }) {
    return {
        article: await api.articles.fetchById(params.id)
    };
}