<script lang="ts">
	import { createForm } from 'svelte-forms-lib'

	import FaGithub from 'svelte-icons/fa/FaGithub.svelte'
	import FaGoogle from 'svelte-icons/fa/FaGoogle.svelte'
	import FaFacebookF from 'svelte-icons/fa/FaFacebookF.svelte'

	import { LoginSchema } from '@lib/validations'
	import user, { type User } from '@lib/stores/user'
	import api from '@lib/services'

	import { Input } from '@lib/components/forms'
	import { Button } from '@lib/components/ui-core'

	const { form, errors, handleChange, handleSubmit } = createForm({
		initialValues: {
			email: '',
			password: ''
		},
		validationSchema: LoginSchema,
		onSubmit: ({ email, password }) => {
			api.auth
				.login({ identifier: email, password })
				.then((res) => ($user = res as User))
				.catch((err) => console.log(err))
		}
	})
</script>

<section class="max-w-lg mx-auto px-4 space-y-16">
	<div class="flex flex-col space-y-8">
		<h1 class="text-primary-600 font-bold text-4xl">Login</h1>
		<div class="flex space-x-8">
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
		<form on:submit|preventDefault={handleSubmit} class="flex flex-col space-y-8" action="">
			<Input
				id="email"
				name="email"
				label="Email"
				placeholder="Email"
				bind:value={$form.email}
				{handleChange}
				bind:error={$errors.email}
			/>
			<div class="flex flex-col space-y-2">
				<Input
					id="password"
					name="password"
					label="Password"
					type="password"
					placeholder="Password"
					bind:value={$form.password}
					{handleChange}
					bind:error={$errors.password}
				/>
				<small class="text-primary-500 text-end font-semibold">Forgot password?</small>
			</div>
			<div class="flex flex-col space-y-4">
				<Button type="submit" width="full">Login</Button>
				<span>Do you not have an account? <b class="underline text-primary-500">Signup now</b></span
				>
			</div>
		</form>
	</div>
</section>
