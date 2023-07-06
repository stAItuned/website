import type { Field } from '@shared/components/forms/types'
import { Input } from '@shared/components/forms'
import AvatarDropzone from '@protected/components/profile-features/avatar-dropzone.svelte'

export const editProfileFields: Field[] = [
	{
		attributes: {
			name: 'firstname',
			label: 'Firstname',
			placeholder: 'John'
		},
		// @ts-ignore
		component: Input
	},
	{
		attributes: {
			name: 'lastname',
			label: 'Lastname',
			placeholder: 'Doe'
		},
		// @ts-ignore
		component: Input
	},
	{
		attributes: {
			name: 'job',
			label: 'Job',
			placeholder: 'Your current job'
		},
		// @ts-ignore
		component: Input
	},
	{
		attributes: {
			name: 'linkedin',
			label: 'LinkedIn',
			placeholder: 'Your LinkedIn username'
		},
		// @ts-ignore
		component: Input
	},
	{
		attributes: {
			name: 'bio',
			label: 'Short Bio',
			placeholder: 'I love writing...',
			type: 'textarea',
			rows: 5
		},
		// @ts-ignore
		component: Input
	}
]