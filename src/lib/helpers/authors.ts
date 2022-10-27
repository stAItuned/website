import type { Teams } from "@lib/configs";
import type { Article, Author } from "@lib/interfaces";

export const filterByTeam = (authors: Author[], team: typeof Teams.NAMES[number]): Author[] => {
    return authors.filter((author) => author.team.includes(team))
}

export const sortByOrder = (authors: Author[], order: string[]): Author[] => {
    return authors.sort((a1, a2) => {
        return (
            (order.indexOf(a1.name) !== -1 ? order.indexOf(a1.name) : order.length) -
            (order.indexOf(a2.name) !== -1 ? order.indexOf(a2.name) : order.length)
        )
    })
}

export const sortByArticlesReadingTime = (authors: Author[], articles: Article[]): Author[] => {
    return authors.sort((a1, a2) => {
        return articles.filter(article => article.author === a2).reduce((prev, curr) => prev + curr.metadata.readingTime, 0) -
            articles.filter(article => article.author === a1).reduce((prev, curr) => prev + curr.metadata.readingTime, 0)

    })
}