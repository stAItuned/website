<script lang="ts">
	import SecondaryPageMetaTags from '@lib/seo/SecondaryPageMetaTags.svelte'
	import api from '@lib/services'
	import { Button } from '@shared/components/ui-core'

	let formContactData = {
		name: '',
		subject: '',
		email: '',
		text: ''
	}

	let buttonMsg = 'Send'

	const handleSubmit = async () => {
		try {
			buttonMsg = 'Sending...'
			await api.contacts.create(formContactData)
			setTimeout(() => {
				formContactData = { name: '', subject: '', email: '', text: '' }
				buttonMsg = 'Success!'
			}, 1000)
			setTimeout(() => {
				buttonMsg = 'Send'
			}, 2000)
		} catch (err) {
			console.error(err)
			buttonMsg = 'Sending failed'
			setTimeout(() => {
				formContactData = { name: '', subject: '', email: '', text: '' }
				buttonMsg = 'Send'
			}, 1000)
		}
	}
</script>

<SecondaryPageMetaTags
	pageTitle="Keep in touch"
	pageDescription="Contact us"
	pagePath="/keepintouch"
/>

<div
	class="flex lg:flex-row flex-col max-w-7xl mx-auto items-center px-8 lg:px-16 space-y-16 lg:space-y-0 my-32 lg:space-x-24"
>
	<center class="relative bg-primary-600 text-white p-16 rounded w-full">
		<div
			class="bg-secondary-600 absolute -top-5 lg:-top-10 right-5 lg:right-10 w-full h-full -z-10 rounded"
		/>
		<div class="space-y-10">
			<h1 class="text-4xl font-semibold">Wanna stAI with us?</h1>
			<div class="space-y-1 text-md md:text-lg">
				<p>We are an open knowledge community and we are glad to share everyone's AI knowledge</p>
				<p>From practical AI applications to AI curiosities</p>
				<p>It's your time to spread AI culture!</p>
			</div>
			<div class="space-y-2 font-semibold text-secondary-600">
				<h1 class="text-2xl">Be part of our community!</h1>
				<h3 class="text-xl">Present yourself!</h3>
			</div>
		</div>
	</center>

	<form
		class="relative p-8 w-full sm:w-2/3 text-sm bg-secondary-600 rounded space-y-4"
		on:submit|preventDefault={handleSubmit}
	>
		<div
			class="bg-primary-600 absolute -top-5 lg:-top-10 right-5 lg:right-10 w-full h-full -z-10 rounded"
		/>
		<input
			class="w-full rounded-lg p-3 border-0 shadow"
			bind:value={formContactData.name}
			type="text"
			id="fname"
			name="fname"
			placeholder="Name and surname*"
			required
		/><br />
		<input
			class="w-full rounded-lg p-3 border-0 shadow"
			bind:value={formContactData.subject}
			type="text"
			id="fobject"
			name="fobject"
			placeholder="Subject*"
			required
		/><br />
		<input
			class="w-full rounded-lg p-3 border-0 shadow"
			bind:value={formContactData.email}
			type="email"
			id="femail"
			name="femail"
			placeholder="Email*"
			required
		/><br />
		<textarea
			bind:value={formContactData.text}
			id="ftext"
			name="ftext"
			placeholder="Text*"
			class="w-full rounded-lg p-3 border-0 shadow"
			rows="4"
			required
		/>

		<Button type="submit" variant="primary" width="full" rounded="lg">{buttonMsg}</Button>
	</form>
</div>
