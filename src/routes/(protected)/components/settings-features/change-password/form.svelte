<script lang='ts'>
	import { Form, type FormProps } from 'svelte-forms-lib'
	import { Button } from 'flowbite-svelte'
	import { ChangePasswordSchema } from '@lib/validations'
	import { fields } from './fields'
	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'
	import api from '@lib/services'
	import { goto } from '$app/navigation'

	const { addNotification } = getNotificationsContext()

	const handleSubmit = (values) => {
		api.auth.changePassword(values)
			.then(res => {
				goto('/profile')
				addNotification(notify.success('Your password has been updated successfully'))
			})
			.catch((err) => addNotification(notify.error(err)))
	}

	const initialValues = { currentPassword: '', password: '', passwordConfirmation: '' }

	const formProps: FormProps = {
		initialValues,
		validationSchema: ChangePasswordSchema,
		onSubmit: handleSubmit
	}
</script>

<Form {...formProps} class='flex flex-col space-y-8' let:errors>
	{#each fields as field}
		<svelte:component this={field.component} {...field.attributes} {errors} />
	{/each}
	<Button class='mt-3' type='submit' size='xl'>Change password</Button>
</Form>
