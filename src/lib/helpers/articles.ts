import type { Filters } from "@lib/configs";
import type { CreationDate, Language, ReadingTime, Tag } from "@lib/types";
import type { Article, Filter } from "@lib/interfaces";
import * as date from "./date";

export const filterbyTopic = (articles: Article[], tags: Tag[]): Article[] => {
    return articles.filter(article => article.metadata.topics.some((topic) => tags.includes(topic as typeof Filters.TAGS[number])))
}

export const filterByPublicationDate = (articles: Article[], publicationDate: CreationDate): Article[] => {
    return articles.filter(article => ((publicationDate !== 'Always' &&
        ((publicationDate === 'Last month' &&
            date.isArticleCreatedLastMonth(article)) ||
            (publicationDate === 'Last week' &&
                date.isArticleCreatedLastWeek(article)))) ||
        publicationDate === 'Always'))
}

export const filterByReadingTime = (articles: Article[], times: ReadingTime[]): Article[] => {
    return articles.filter(article => ((times.includes('Less than 5 min') &&
        article.metadata.readingTime < 5) ||
        (times.includes('5 - 10 min') &&
            article.metadata.readingTime >= 5 &&
            article.metadata.readingTime <= 10) ||
        (times.includes('More than 10 min') &&
            article.metadata.readingTime > 10)))
}

export const filterByLanguage = (articles: Article[], languages: Language[]): Article[] => {
    return articles.filter(article => languages.includes(article.metadata.language as typeof Filters.LANGUAGES[number]))
}

export const applyFilters = (articles: Article[], filter: Filter): Article[] => {
    return filterbyTopic(
        filterByPublicationDate(
            filterByReadingTime(
                filterByLanguage(articles, filter.languages),
                filter.readingTime),
            filter.creationDate),
        filter.tags)
}