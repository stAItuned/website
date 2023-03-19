<script lang='ts'>
	import api from '@lib/services'

	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'

	import { Form, type FormProps } from 'svelte-forms-lib'
	import { ForgotPasswordSchema } from '@lib/validations'
	import { Input } from '@shared/components/forms'
	import { emailField } from '../fields'

	import { Button, Card } from 'flowbite-svelte'

	const { addNotification } = getNotificationsContext()

	let showSuccessMessage = false

	const formProps: FormProps = {
		initialValues: { email: '' },
		validationSchema: ForgotPasswordSchema,
		onSubmit: ({ email }) => {
			api.auth
				.forgotPassword(email as string)
				.then(() => showSuccessMessage = true)
				.catch((err) => addNotification(notify.error(err)))
		}
	}
</script>


<section>
	{#if !showSuccessMessage}
		<Card size='md' class='mx-auto'>
			<h3 class='text-xl font-semibold text-gray-900 mb-6'>Forgot password?</h3>
			<div class='flex flex-col space-y-6'>
				<Form {...formProps} let:errors let:updateField class='flex flex-col space-y-8'>
					<Input {...emailField.attributes} {errors} />
					<Button type='submit' size='lg' color='primary'>Reset password</Button>
				</Form>
				<span class='text-xs'>
					Do you not have to reset your password?
						<a href='/login' class=''>
							<b class='underline text-primary-500 hover:text-primary-300'>Login now</b>
						</a>
						or
						<a href='/signup' class=''>
							<b class='underline text-primary-500 hover:text-primary-300'>Signup now</b>
						</a>
				</span>
			</div>
		</Card>
	{:else}
		<div class='flex flex-col justify-center items-center text-center'>
			<h3 class='text-4xl font-bold text-primary-600 mb-6'>An email has been sent to you</h3>
			<p class='text-slate-500 mb-2'>We have been sent to you an email to reset the password for your account.</p>
		</div>
	{/if}
</section>

