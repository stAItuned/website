import dayjs from 'dayjs'

import type { Article } from '@lib/interfaces'

const mostRecentArticleFirst = (articles: Article[]): Article[] => {
    return articles.sort((a: Article, b: Article) => {
        if (dayjs(a.metadata.date).isAfter(dayjs(b.metadata.date))) return -1
        else return 1
    })
}

export const sort = { mostRecentArticleFirst }