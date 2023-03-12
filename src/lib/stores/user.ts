import { writable } from 'svelte/store'
import type { UserAttributes } from '@lib/models'

type UserStore = UserAttributes | null

const user = writable<UserStore>(null)
export default user