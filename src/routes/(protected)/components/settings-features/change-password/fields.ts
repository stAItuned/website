import type { Field } from '@shared/components/forms/types'
import { Input } from '@shared/components/forms'

export const fields: Field[] = [
	{
		attributes: {
			name: 'currentPassword',
			label: 'Current password',
			placeholder: 'Current password',
			type: 'password'
		},
		// @ts-ignore
		component: Input
	},
	{
		attributes: {
			name: 'password',
			label: 'New password',
			placeholder: 'New password',
			type: 'password'
		},
		// @ts-ignore
		component: Input
	},
	{
		attributes: {
			name: 'passwordConfirmation',
			label: 'Confirm new password',
			placeholder: 'Confirm password',
			type: 'password'
		},
		// @ts-ignore
		component: Input
	}
]