import type { ArticleMetadata, Article, Cover } from "@lib/interfaces";

const validMetadata: Record<keyof Omit<ArticleMetadata, 'cover' | 'readingTime'>, string> = {
    title: 'string',
    author: 'string',
    date: 'string',
    topics: 'array',
    meta: 'string',
    target: 'string',
    language: 'string',
}

const isValidMetadata = (input: any): input is Omit<ArticleMetadata, 'cover' | 'readingTime'> => {
    const missing_keys = Object.keys(validMetadata).filter((key) => !input[key])
    return missing_keys.length === 0
}

const getInfoFromPath = (filepath: string): [slug: string, filename: string] => {
    const slug = filepath.split('/').at(-2) as string
    const filename = (filepath.split('/').at(-1) as string).slice(0, -3)
    return [slug, filename]
}

const isValidUrl = (url: string): boolean => {
    try {
        new URL(url)
    } catch {
        return false
    }
    return true
}

const computeReadingTime = (html: string): number => {
    const wordsPerMinute = 250 as const
    const words = html.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
}

const getPublishedArticles = (articles: (Article | undefined)[]): Article[] => {
    const filteredArticles: (Article | undefined)[] = articles.filter((article: Article | undefined) => {
        return article !== undefined
    })

    return filteredArticles as Article[]
}

const loadCovers = (articles: Article[]): Promise<Cover[]> => {
    return new Promise((resolve) => {
        const covers: Cover[] = []
        articles.forEach((article: Article, idx) => {
            import(/* @vite-ignore */`./content/articles/${article.slug}/${article.metadata.cover}?w=1280?webp`)
                .then(image => {
                    covers.push({
                        image: image.default,
                        article: article.slug
                    })
                })
                .catch(() => {
                    if (isValidUrl(article.metadata.cover))
                        covers.push({ article: article.slug, image: article.metadata.cover })
                    else covers.push({ article: article.slug, image: `https://og-image.vercel.app/${encodeURI(article.metadata.title)}.png?theme=dark&fontSize=150px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fhyper-bw-logo.svg&&images=https://i.imgur.com/YAKfI5F.png&widths=0&heights=0` })
                })
                .finally(() => {
                    if (idx === articles.length - 1)
                        resolve(covers)
                })
        })
    })
}

export { getInfoFromPath, isValidMetadata, computeReadingTime, getPublishedArticles, loadCovers }