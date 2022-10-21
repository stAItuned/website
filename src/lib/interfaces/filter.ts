import type { Filters } from "@lib/configs"

type Tag = typeof Filters.TAGS[number]
type CreationDate = typeof Filters.CREATION_DATES[number]
type ReadingTime = typeof Filters.READING_TIME[number]
type Language = typeof Filters.LANGUAGES[number]

export default interface Filter {
    tags: Tag[],
    creationDate: CreationDate,
    readingTime: ReadingTime[],
    languages: Language[],
    searchParam: string,
}