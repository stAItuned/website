import type { Filters } from "@lib/constants"

export type Tag = typeof Filters.TAGS[number]
export type CreationDate = typeof Filters.CREATION_DATES[number]
export type Language = typeof Filters.LANGUAGES[number]

export default interface Filter {
    tags: Tag[],
    creationDate: CreationDate,
    languages: Language[],
    searchParam: string
}