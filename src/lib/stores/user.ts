import { writable } from "svelte/store";

export interface User {
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    provider: string,
    confirmed: boolean,
    blocked: boolean,
    createdAt: string,
    updatedAt: string
}

const user = writable<User | null>(null);
export default user