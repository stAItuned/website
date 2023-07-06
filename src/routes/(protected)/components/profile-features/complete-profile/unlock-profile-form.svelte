<script lang='ts'>
	import { Form } from 'svelte-forms-lib'
	import { Button } from 'flowbite-svelte'
	import { UnlockProfileSchema } from '@lib/validations'
	import { unlockProfileFields } from './fields'
	import { user } from '@lib/stores'
	import { get } from 'svelte/store'
	import { getNotificationsContext } from 'svelte-notifications'

	export let handleNextStep: () => void
	export let profile: any
	export let profilePic: File | undefined

	const { addNotification } = getNotificationsContext()
	const author = get(user)?.author

	const handleSubmit = (values, avatar) => {
		profile = { ...profile, ...values, avatar }
		handleNextStep()
	}

	const initialValues = { firstname: '', lastname: '' }

	const formProps = {
		initialValues,
		validationSchema: UnlockProfileSchema,
		onSubmit: (values) => handleSubmit(values, profilePic)
	}
</script>

<Form {...formProps} class='flex flex-col space-y-8 items-center w-full' let:errors>
	<div class='flex flex-col items-center justify-center w-full'>
		<div class='flex flex-col items-center gap-6 w-full lg:w-1/2'>
			{#each unlockProfileFields as field}
				<svelte:component
					this={field.component}
					{...field.attributes}
					{errors}
					bind:file={profilePic}
					class='w-full'
				/>
			{/each}
			<Button class='mt-3' type='submit' size='xl'>Unlock functionalities</Button>
		</div>
	</div>
</Form>
