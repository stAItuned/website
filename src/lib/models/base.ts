export interface BaseAttributes {
    createdAt?: string,
    updatedAt?: string,
    publishedAt?: string,
}

export interface BaseData<T extends BaseAttributes> {
    id: number,
    attributes: T
}

export interface PaginationResponse {
    page: number,
    pageSize: number,
    pageCount: number,
    total: number
}

export interface BaseMeta {
    pagination: PaginationResponse
}

export interface EntryResponse<T extends BaseAttributes> {
    data?: BaseData<T>
}

export interface EntriesResponse<T extends BaseAttributes> {
    data?: BaseData<T>[],
    meta: BaseMeta
}

export interface ErrorResponse {
    data: null,
    error: {
        status: number,
        name: string,
        message: string,
        details?: any
    }
}