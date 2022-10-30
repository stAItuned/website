import dayjs from 'dayjs'

import type { Article } from '@lib/interfaces'

const now = () => dayjs()

const mostRecentArticleFirst = (articles: Article[]): Article[] => {
    return articles.sort((a: Article, b: Article) => {
        if (dayjs(a.metadata.date).isAfter(dayjs(b.metadata.date))) return -1
        else return 1
    })
}

export const isArticleCreatedLastWeek = (article: Article): boolean => {
    return dayjs(article.metadata.date).isAfter(now().subtract(1, 'week'))
}

export const isArticleCreatedLastMonth = (article: Article): boolean => {
    return dayjs(article.metadata.date).isAfter(now().subtract(1, 'month'))
}

export const sort = { mostRecentArticleFirst }