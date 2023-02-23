<script lang="ts">
	import { Form, type FormProps } from 'svelte-forms-lib'

	import FaGithub from 'svelte-icons/fa/FaGithub.svelte'
	import FaGoogle from 'svelte-icons/fa/FaGoogle.svelte'
	import FaFacebookF from 'svelte-icons/fa/FaFacebookF.svelte'

	import { SignupSchema } from '@lib/validations'
	import user, { type User } from '@lib/stores/user'
	import api from '@lib/services'

	import { Input } from '@lib/components/forms'
	import { Button } from '@lib/components/ui-core'

	const formProps: FormProps = {
		initialValues: { firstname: '', lastname: '', email: '', password: '', confirmPassword: '' },
		validationSchema: SignupSchema,
		onSubmit: ({ firstname, lastname, email, password }) => {
			api.auth
				.signup({
					firstname: firstname as string,
					lastname: lastname as string,
					email: email as string,
					password: password as string
				})
				.then((res) => ($user = res as User))
				.catch((err) => console.log(err))
		}
	}

	interface Field {
		name: string
		label: string
		placeholder: string
		type?: 'password' | 'text'
	}

	const fields: Field[] = [
		{
			name: 'firstname',
			label: 'Firstname',
			placeholder: 'Mario',
		},
		{
			name: 'lastname',
			label: 'Lastname',
			placeholder: 'Rossi',
		},
		{
			name: 'email',
			label: 'Email',
			placeholder: 'me@example.com',
		},
		{
			name: 'password',
			label: 'Password',
			placeholder: 'Password',
			type: 'password'
		},
		{
			name: 'confirmPassword',
			label: 'Confirm password',
			placeholder: 'Confirm password',
			type: 'password'
		}
	]
</script>

<section class="w-full px-4">
	<div class="flex flex-col space-y-8 max-w-3xl mx-auto">
		<h1 class="text-primary-600 font-bold text-4xl">Signup</h1>
		<div class="max-w-lg flex space-x-8">
			<div class="bg-slate-900 text-white flex justify-center items-center rounded-xl w-1/3">
				<div class="w-8 h-8">
					<FaGithub />
				</div>
			</div>
			<div class="bg-red-400 text-white py-2 flex justify-center items-center rounded-xl w-1/3">
				<div class="w-8 h-8">
					<FaGoogle />
				</div>
			</div>
			<div class="bg-sky-500 text-white py-2 flex justify-center items-center rounded-xl w-1/3">
				<div class="w-8 h-8">
					<FaFacebookF />
				</div>
			</div>
		</div>
		<div class="border w-full border-slate-100" />
		<Form {...formProps} let:errors class="flex flex-col space-y-8">
			<div class="grid grid-cols-2 gap-8">
				{#each fields as field}
					<Input
						id={field.name}
						name={field.name}
						label={field.label}
						placeholder={field.placeholder}
						type={field.type || 'text'}
						errors={errors}
						class={field.name === 'email' ? 'col-span-2' : 'col-span-1'}
					/>
				{/each}
			</div>
			<div class="flex flex-col space-y-4">
				<Button type="submit" width="full">Signup</Button>
				<span
					>Do you already have an account?
					<a href="/login" class="">
						<b class="underline text-primary-500 hover:text-primary-300">Login now</b>
					</a>
				</span>
			</div>
		</Form>
	</div>
</section>
