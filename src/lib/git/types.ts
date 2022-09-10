export interface ArticleMetadata{ 
    title: string,
    author: string,
    date: string,
    tags: string[]
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