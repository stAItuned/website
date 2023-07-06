<script lang='ts'>
	import { Form, type FormProps } from 'svelte-forms-lib'
	import { Button, Indicator } from 'flowbite-svelte'
	import { Pencil } from 'svelte-heros-v2'
	import { EditProfileSchema } from '@lib/validations'
	import { editProfileFields } from './fields'
	import { user } from '@lib/stores'

	import AvatarDropzone from '@protected/components/profile-features/avatar-dropzone.svelte'

	import { getNotificationsContext } from 'svelte-notifications'
	import { get } from 'svelte/store'
	import api from '@lib/services'
	import { notify } from '@lib/hooks'
	import { goto } from '$app/navigation'


	const { addNotification } = getNotificationsContext()

	const profile = get(user)?.author

	const handleSubmit = (values) => {
		api.profile.update(profile!.id, values)
			.then(res => {
				user.set(res)
				addNotification(notify.success('Your profile has been updated successfully'))
				goto("/profile")
			})
			.catch((err) => addNotification(notify.error(err)))
	}

	let avatar: File
	const avatarPreview = profile?.avatar?.url

	const initialValues = {
		firstname: profile?.firstname,
		lastname: profile?.lastname,
		job: profile?.job,
		linkedin: profile?.linkedin,
		bio: profile?.bio
	}

	const formProps: FormProps = {
		initialValues,
		validationSchema: EditProfileSchema,
		onSubmit: handleSubmit
	}
</script>

<Form {...formProps} class='flex flex-col space-y-8' let:errors>
	<div class='flex flex-col xl:flex-row items-center xl:items-start gap-16'>
		<div class='relative'>
			<Indicator placement='top-right' color='dark' size='xl'>
				<Pencil class='text-white w-3 h-3' variation='solid' />
			</Indicator>
			<AvatarDropzone name='avatar' bind:file={avatar} preview={avatarPreview} />
		</div>
		<div class='w-full grid grid-cols-2 gap-8'>
			{#each editProfileFields as field}
				<svelte:component
					this={field.component}
					{...field.attributes}
					{errors}
					preview={avatarPreview}
					bind:file={avatar}
					class={`w-full ${field.attributes?.name === "bio" ? "col-span-2" : "col-span-2 lg:col-span-1"}`}
				/>
			{/each}
			<Button class='mt-3 col-span-2' type='submit' size='xl'>Save</Button>
		</div>
	</div>
</Form>
