import { writable } from 'svelte/store'
import type { UserAttributes } from '@lib/models'

type UserStore = UserAttributes | null

const user = writable<UserStore>(null)
export default user

export const utils = {
	name: {
		getFullname: (user: UserStore): string => `${user?.author.firstname} ${user?.author.lastname}`,
		getInitials: (user: UserStore): string => `${user?.author.firstname?.at(0)}${user?.author.lastname?.at(0)}`.toUpperCase()
	}
}
