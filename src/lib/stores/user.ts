import { writable } from 'svelte/store'
import type { UserAttributes } from '@lib/models'

type UserStore = UserAttributes | null

const user = writable<UserStore>(null)
export default user

export const utils = {
	name: {
		getFullname: (user: UserStore): string => `${user?.firstname} ${user?.lastname}`,
		getInitials: (user: UserStore): string => `${user?.firstname[0]}${user?.lastname[0]}`.toUpperCase()
	}
}
