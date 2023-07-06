<script>
	import { EditOverview } from '@protected/components/profile-features'
	import { Heading } from 'flowbite-svelte'
</script>

<header>
	<Heading tag='h2' customSize='text-4xl font-bold'>
		Edit <span class='font-black text-blue-600'>
			overview
		</span>
	</Heading>
	<p class='my-4 text-slate-500'>
		Write, edit and publish from here. You can also see your profile and set your overview.
	</p>
</header>

<EditOverview/>