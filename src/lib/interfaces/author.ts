import type { Article } from './article'

interface Author {
    name: string
    team: string[]
    title: string
    linkedin: string
    email: string
    description: string
    propic: string
    articles?: Article[] | undefined
}

export default Author