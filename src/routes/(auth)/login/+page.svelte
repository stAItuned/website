<script lang='ts'>
	import { Form, type FormProps } from 'svelte-forms-lib'

	import { LoginSchema } from '@lib/validations'
	import user from '@lib/stores/user'
	import api from '@lib/services'

	import { loginFields as fields } from '../fields'

	import { goto } from '$app/navigation'
	import { Hr, Button, Card } from 'flowbite-svelte'
	import Providers from '../components/providers.svelte'
	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'

	const { addNotification } = getNotificationsContext()

	const formProps: FormProps = {
		initialValues: { email: '', password: '' },
		validationSchema: LoginSchema,
		onSubmit: ({ email, password }) => {
			api.auth
				.login({ identifier: email as string, password: password as string })
				.then((res) => {
					user.set(res)
					goto('/dashboard')
						.then(() => addNotification(notify.success(`Welcome, ${res.firstname}!`)))
				})
				.catch((err) => addNotification(notify.error(err)))
		}
	}
</script>

<section>
	<Card size='md' class='mx-auto'>
		<h3 class='text-xl font-semibold text-gray-900 mb-6'>Login</h3>
		<div class='flex flex-col space-y-6'>
			<Form {...formProps} let:errors let:updateField class='flex flex-col space-y-8'>
				<div class='flex flex-col space-y-4'>
					{#each fields as field}
						<svelte:component
							this={field.component}
							{...field.attributes}
							{errors}
						/>
					{/each}
					<a href='/forgot-password' class='text-primary-500 text-sm text-end font-semibold'>Forgot password?</a>
				</div>
				<div class='flex flex-col space-y-4'>
					<Button type='submit' size='lg' color='primary'>Login</Button>
					<span class='text-xs'
					>Do you not have an account yet?
						<a href='/signup' class=''>
							<b class='underline text-primary-500 hover:text-primary-300'>Signup now</b>
						</a>
					</span>
				</div>
			</Form>
			<Hr class='my-3'>or</Hr>
			<Providers />
		</div>
	</Card>
</section>
