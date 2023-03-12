<script lang='ts'>
	import type { PageData } from './$types'

	import api from '@lib/services'

	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'

	import { Form, type FormProps } from 'svelte-forms-lib'
	import { ResetPasswordSchema } from '@lib/validations'
	import { resetPasswordFields as fields } from '../fields'

	import { Button, Card } from 'flowbite-svelte'
	import { goto } from '$app/navigation'
	import user from '@lib/stores/user'

	export let data: PageData
	const { code }: string = data

	const { addNotification } = getNotificationsContext()

	const formProps: FormProps = {
		initialValues: { password: '', passwordConfirmation: '', code },
		validationSchema: ResetPasswordSchema,
		onSubmit: ({ password, passwordConfirmation, code }) => {
			api.auth
				.resetPassword({
					password: password as string,
					passwordConfirmation: passwordConfirmation as string,
					code: code as string
				})
				.then((res) => {
					user.set(res)
					addNotification(notify.success('Great! Your password has been successfully reset!'))
					goto('/dashboard')
				})
				.catch((err) => addNotification(notify.error(err)))
		}
	}
</script>

<section>
	<Card size='md' class='mx-auto'>
		<h3 class='text-xl font-semibold text-gray-900 mb-6'>Reset password</h3>
		<Form {...formProps} let:errors class='flex flex-col space-y-8'>
			<div class='flex flex-col space-y-4'>
				{#each fields as field}
					<svelte:component
						this={field.component}
						{...field.attributes}
						{errors}
					/>
				{/each}
			</div>
			<Button type='submit' size='lg' color='primary'>Reset password</Button>
		</Form>
	</Card>
</section>