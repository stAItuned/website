<script lang="ts">
	let formData = {
		subject: '',
		name: '',
		email: '',
		body: ''
	}
	
	function submitForm() {
		const subject = encodeURI(`${formData.subject} | ${formData.name} | ${formData.email}`)
		const url = `mailto:staituned.owner@gmail.com?subject=${subject}&body=${encodeURI(
			formData.body
		)}`
		if (formData.subject !== '' && formData.body !== '' && formData.email !== '') window.open(url)
	}
</script>

<div class="flex lg:flex-row flex-col max-w-7xl mx-auto items-center px-8 lg:px-16 space-y-16 lg:space-y-0 py-24 lg:space-x-24">
	<!-- generalize! -->
	<center class="relative bg-primary-600 text-white p-16 rounded w-full">
		<div
			class="bg-stayYellow-600 absolute -top-5 lg:-top-10 right-5 lg:right-10 w-full h-full -z-10 rounded"
		/>
		<div class="space-y-10">
			<h1 class="text-4xl font-semibold">Wanna stAI with us?</h1>
			<div class="space-y-1 text-md md:text-lg">
				<p>We are an open knowledge community and we are glad to share everyone's AI knowledge</p>
				<p>From practical AI applications to AI curiosities</p>
				<p>It's your time to spread AI culture!</p>
			</div>
			<div class="space-y-2 font-semibold text-stayYellow-600">
				<h1 class="text-2xl">Be part of our community!</h1>
				<h3 class="text-xl">Present yourself!</h3>
			</div>
			<!-- <p class="text-md md:text-xl">
				Do you want to <b>collaborate</b> with us? <br />
				Do you want to <b>share</b> some brilliant ideas? <br />
				Do you want to get some <b>reading tips</b>? <br />
				<br />
				We are looking forward to hearing from you!
			</p> -->
		</div>
	</center>

	<form
		class="relative p-8 w-full sm:w-2/3 text-sm bg-stayYellow-600 rounded space-y-4"
		on:submit|preventDefault={submitForm}
	>
		<div
			class="bg-primary-600 absolute -top-5 lg:-top-10 right-5 lg:right-10 w-full h-full -z-10 rounded"
		/>
		<input
			class="w-full rounded p-3 border-0 shadow"
			bind:value={formData.name}
			type="text"
			id="fname"
			name="fname"
			placeholder="Name and surname*"
			required
		/><br />
		<input
			class="w-full rounded p-3 border-0 shadow"
			bind:value={formData.subject}
			type="text"
			id="fobject"
			name="fobject"
			placeholder="Subject*"
			required
		/><br />
		<input
			class="w-full rounded p-3 border-0 shadow"
			bind:value={formData.email}
			type="email"
			id="femail"
			name="femail"
			placeholder="Email*"
			required
		/><br />
		<textarea
			bind:value={formData.body}
			id="ftext"
			name="ftext"
			placeholder="Text*"
			class="w-full rounded p-3 border-0 shadow"
			rows="4"
			required
		/>

		<button
			type="submit"
			class="p-4 bg-primary-400 px-8 w-full hover:bg-primary-500 active:bg-primary-600 transition w-fit text-white rounded"
		>
			<span class="font-semibold">Send</span>
		</button>
	</form>
</div>
