import type { Attributes, Entry, ResponseEntry } from "./base";

/* Attributes */

interface TargetAttributes extends Attributes {
    label: string
}

interface TopicAttributes extends Attributes {
    label: string
}

interface ArticleAttributes extends Attributes {
    title: string,
    slug: string,
    description: string,
    language: string
    content: string,
    target?: { data: ResponseTarget },
    topics?: { data: ResponseTopic[] },
}

/* ResponseEntries */

export interface ResponseTarget extends ResponseEntry {
    attributes: TargetAttributes
}

export interface ResponseTopic extends ResponseEntry {
    attributes: TopicAttributes
}

export interface ResponseArticle extends ResponseEntry {
    attributes: ArticleAttributes
}

/* Entries */

export interface Target extends Entry, TargetAttributes { }
export interface Topic extends Entry, TopicAttributes { }
export interface Article extends Entry, ArticleAttributes { }
