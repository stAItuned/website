import type { DefaultNotificationOptions } from 'svelte-notifications'

const base: DefaultNotificationOptions = {
	position: 'top-right',
	removeAfter: 5 * 1000
}

const createNotification = (type: string, text: string) => ({
	...base,
	type,
	text
})

const error = (text: string) => createNotification('error', text)
const success = (text: string) => createNotification('success', text)

const notify = { error, success }
export default notify