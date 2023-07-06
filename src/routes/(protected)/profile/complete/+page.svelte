<script lang='ts'>
	import { Heading, StepIndicator } from 'flowbite-svelte'
	import { UnlockProfileForm, MoreDetailsForm, OverviewEditor } from '@protected/components/profile-features'
	import { onMount } from 'svelte'
	import { user } from '@lib/stores'
	import { goto } from '$app/navigation'
	import { get } from 'svelte/store'
	import api from '@lib/services'
	import { getNotificationsContext } from 'svelte-notifications'
	import { notify } from '@lib/hooks'

	const { addNotification } = getNotificationsContext()

	onMount(() => {
		if (get(user)?.author.unlocked)
			goto('/profile')
	})

	const steps = ['Unlock functionalities', 'More details', 'Write more about you']

	let currentStep = 1
	const handleNextStep = () => currentStep += 1

	let profile: any = {
		firstname: undefined,
		lastname: undefined,
		details: {
			job: undefined,
			linkedin: undefined,
			bio: undefined,
			overview: undefined
		}
	}

	let avatar: File | undefined = undefined

	const handleSubmit = () => {
		api.profile.complete(get(user)?.author.id!, profile!, avatar)
		.then((res) => {
			user.set(res)
			addNotification(notify.success('Your profile has been unlocked successfully'))
			goto("/profile")
		})
		.catch((err) => addNotification(notify.error(err)))
	}

</script>


{#if !$user.author.unlocked}
	<header>
		<Heading tag='h2' customSize='text-4xl font-bold'>
			Complete <span class='font-black text-blue-600'>
			profile
		</span>
		</Heading>
		<p class='my-4 text-slate-500'>
			Write, edit and publish from here. You can also see your profile and set your overview.
		</p>
	</header>

	<StepIndicator class='!my-8' {currentStep} {steps} size='h-1.5' />

	<div class='pb-16'>
		{#if currentStep === 1}
			<UnlockProfileForm {handleNextStep} bind:profile={profile} bind:profilePic={avatar} />
		{:else if currentStep === 2}
			<MoreDetailsForm {handleNextStep} bind:profile={profile} submit={handleSubmit} />
		{:else}
			<OverviewEditor bind:profile={profile} submit={handleSubmit} />
		{/if}
	</div>
{/if}