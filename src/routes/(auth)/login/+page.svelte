<script lang="ts">
	import { Form, type FormProps } from 'svelte-forms-lib'

	import FaGithub from 'svelte-icons/fa/FaGithub.svelte'
	import FaGoogle from 'svelte-icons/fa/FaGoogle.svelte'
	import FaFacebookF from 'svelte-icons/fa/FaFacebookF.svelte'

	import { LoginSchema } from '@lib/validations'
	import user, { type User } from '@lib/stores/user'
	import api from '@lib/services'

	import { Input } from '@lib/components/forms'
	import { Button } from '@lib/components/ui-core'

	const formProps: FormProps = {
		initialValues: { email: '', password: '' },
		validationSchema: LoginSchema,
		onSubmit: ({ email, password }) => {
			api.auth
				.login({ identifier: email as string, password: password as string })
				.then((res) => ($user = res as User))
				.catch((err) => console.log(err))
		}
	}
</script>

<section class="w-full px-4">
	<div class="flex flex-col space-y-8 max-w-lg mx-auto">
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
		<Form {...formProps} class="flex flex-col space-y-8" let:errors>
			<Input name="email" label="Email" placeholder="me@example.com" {errors} />
			<div class="flex flex-col space-y-2">
				<Input
					name="password"
					label="Password"
					placeholder="Enter your password"
					type="password"
					{errors}
				/>
				<small class="text-primary-500 text-end font-semibold">Forgot password?</small>
			</div>
			<div class="flex flex-col space-y-4">
				<Button type="submit" width="full">Login</Button>
				<span
					>Do you not have an account?
					<a href="/signup" class="">
						<b class="underline text-primary-500 hover:text-primary-300">Signup now</b>
					</a>
				</span>
			</div>
		</Form>
	</div>
</section>
