export interface Attributes {
    createdAt?: string,
    updatedAt?: string,
    publishedAt?: string,
}

export interface ResponseEntry {
    id: number,
    attributes: Attributes
}

export interface Entry extends Attributes {
    id: number,
}