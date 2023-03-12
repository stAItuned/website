<script lang='ts'>
	import api from '@lib/services'

	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'

	import { Form, type FormProps } from 'svelte-forms-lib'
	import { SignupSchema } from '@lib/validations'
	import { signupFields as fields } from '../fields'

	import { Hr, Button, Card } from 'flowbite-svelte'
	import Providers from '../components/providers.svelte'

	const { addNotification } = getNotificationsContext()

	let showVerificationMessage = false
	let accountEmail = ''

	const formProps: FormProps = {
		initialValues: { email: '', password: '', confirmPassword: '', toggle: false },
		validationSchema: SignupSchema,
		onSubmit: ({ email, password }) => {
			api.auth
				.signup({
					email: email as string,
					password: password as string
				})
				.then((res) => {
					accountEmail = res.email
					showVerificationMessage = true
				})
				.catch((err) => addNotification(notify.error(err)))
		}
	}

	const handleSendAgain = () => {
		if (accountEmail)
			api.auth.sendEmailConfirmation(accountEmail)
				.then(() => addNotification(notify.success('Great! Your email has been sent successfully!')))
				.catch(err => addNotification(notify.error(err)))
	}
</script>


<section>
	{#if !showVerificationMessage}
		<Card size='md' class='mx-auto'>
			<h3 class='text-xl font-semibold text-gray-900 mb-6'>Signup</h3>
			<div class='flex flex-col space-y-6'>
				<Form {...formProps} let:errors let:updateField class='flex flex-col space-y-8'>
					<div class='flex flex-col space-y-4'>
						{#each fields as field}
							<svelte:component
								this={field.component}
								{...field.attributes}
								{errors}
								on:toggle={(e) => updateField('toggle', e.detail.checked)}
							/>
						{/each}
					</div>
					<div class='flex flex-col space-y-4'>
						<Button type='submit' size='lg' color='primary'>Signup</Button>
						<span class='text-xs'
						>Do you already have an account?
						<a href='/login' class=''>
							<b class='underline text-primary-500 hover:text-primary-300'>Login now</b>
						</a>
					</span>
					</div>
				</Form>
				<Hr class='my-3'>or</Hr>
				<Providers />
			</div>
		</Card>
	{:else}
		<div class='flex flex-col justify-center items-center text-center'>
			<h3 class='text-4xl font-bold text-primary-600 mb-6'>Confirm your registration</h3>
			<p class='text-slate-500 mb-2'>We have been sent to you an email to confirm your registration and verify your
				account.</p>
			<p>Please, first confirm your registration to perform login successfully</p>
			<small class='mt-6 text-slate-500'>Have you not received any mail yet? Try to <span
				class='underline text-primary-500 hover:text-primary-300 font-bold hover:cursor-pointer'
				on:click={handleSendAgain}>Send again</span></small>
		</div>
	{/if}
</section>

