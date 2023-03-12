import type { BaseAttributes, EntryResponse } from "./base";

export interface UserAttributes extends Omit<BaseAttributes, "publishedAt"> {
    id: number,
    email: string,
    provider: string,
    confirmed: boolean,
    blocked: boolean,
    username: string,
    firstname: string,
    lastname: string,
}

export type UserResponse = EntryResponse<Omit<UserAttributes, "id">>

export interface AuthResponse {
    jwt: string,
    user: UserAttributes
}