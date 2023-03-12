import type { Field } from '@components/forms/types'
import { Input, Toggle } from '@components/forms'


export const emailField: Field = {
	attributes: {
		name: 'email',
		label: 'Email',
		placeholder: 'me@example.com'
	},
	// @ts-ignore
	component: Input
}

const passwordField: Field = {
	attributes: {
		name: 'password',
		label: 'Password',
		placeholder: 'Password',
		type: 'password'
	},
	// @ts-ignore
	component: Input
}

export const loginFields: Field[] = [
	emailField,
	passwordField
]

export const signupFields: Field[] = [
	emailField,
	passwordField,
	{
		attributes: {
			name: 'confirmPassword',
			label: 'Confirm password',
			placeholder: 'Confirm password',
			type: 'password'
		},
		// @ts-ignore
		component: Input
	},
	{
		attributes: {
			name: 'toggle',
			label: 'Accept terms and conditions'
		},
		// @ts-ignore
		component: Toggle
	}
]

export const resetPasswordFields: Field[] = [
	passwordField,
	{
		attributes: {
			name: 'passwordConfirmation',
			label: 'Confirm password',
			placeholder: 'Confirm password',
			type: 'password'
		},
		// @ts-ignore
		component: Input
	}
]