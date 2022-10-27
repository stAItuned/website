import type { Filters } from '@lib/configs'

export type Tag = typeof Filters.TAGS[number]
export type CreationDate = typeof Filters.CREATION_DATES[number]
export type ReadingTime = typeof Filters.READING_TIME[number]
export type Language = typeof Filters.LANGUAGES[number]