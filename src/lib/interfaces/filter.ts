import type { Tag, CreationDate, ReadingTime, Language } from "@lib/types"

export default interface Filter {
    tags: Tag[],
    creationDate: CreationDate,
    readingTime: ReadingTime[],
    languages: Language[],
    searchParam: string,
}