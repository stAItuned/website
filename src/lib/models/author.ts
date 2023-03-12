import type { BaseAttributes, EntryResponse, EntriesResponse } from "./base";
import type { UserResponse } from "./user";

export interface AuthorAttributes extends Omit<BaseAttributes, "publishedAt"> {
    job?: string,
    bio?: string,
    overview?: string,
    linkedin?: string,
    user: UserResponse
}

export type AuthorResponse = EntryResponse<AuthorAttributes>
export type AuthorsResponse = EntriesResponse<AuthorAttributes>