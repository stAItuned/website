<script lang='ts'>
	import { Form, type FormProps } from 'svelte-forms-lib'
	import { Button } from 'flowbite-svelte'
	import { MoreDetailsSchema } from '@lib/validations'
	import { moreDetailsFields } from './fields'
	import api from '@lib/services'
	import { user } from '@lib/stores'
	import { getNotificationsContext } from 'svelte-notifications'
	import { get } from 'svelte/store'
	import { notify } from '@lib/hooks'

	export let handleNextStep: () => void
	export let profile: any

	const { addNotification } = getNotificationsContext()
	const author = get(user)?.author

	const handleSubmit = (values) => {
		profile = { ...profile, details: {...values} }
		handleNextStep()
	}

	const initialValues = { job: '', linkedin: '', bio: '' }

	const formProps: FormProps = {
		initialValues,
		validationSchema: MoreDetailsSchema,
		onSubmit: handleSubmit
	}
</script>

<Form {...formProps} class='flex flex-col space-y-8' let:errors>
	<div class='grid grid-cols-2 gap-8'>
		{#each moreDetailsFields as field}
			<svelte:component
				this={field.component}
				{...field.attributes}
				{errors}
				class={`w-full ${field.attributes.name === "bio" && "col-span-2"}`}
			/>
		{/each}
	</div>
	<div class='flex space-x-3 items-center justify-end'>
		<Button class='mt-3' type='submit' size='xl'>Continue</Button>
		<Button class='mt-3' size='xl' color='light' on:click={handleNextStep}>Skip</Button>
	</div>
</Form>
