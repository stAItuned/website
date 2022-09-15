export interface ArticleMetadata{ 
    title: string,
    author: string,
    date: string,
    topics: string[],
    meta: string,
    target: string,
    cover: string
}

export interface Article {
    /**
     * The name of the folder where the post is
     */
    slug: string 
    metadata: ArticleMetadata,
    content?: string | undefined,
    assets?: string | undefined
}