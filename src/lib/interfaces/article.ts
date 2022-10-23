import type Author from './author'

export interface Cover {
    image: string
    article: string,
}

export interface ArticleMetadata {
    title: string
    author: string
    date: string
    topics: string[]
    meta: string
    target: string
    cover: string,
    language: string
    /**in minutes */
    readingTime: number
}

export interface Article {
    /**
     * The name of the folder where the post is
     */
    slug: string
    filename: string,
    metadata: ArticleMetadata
    author?: Author | undefined
}