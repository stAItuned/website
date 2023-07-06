<script>
	import { Button, Heading } from 'flowbite-svelte'
	import { ChangePasswordForm } from '@protected/components/settings-features'
</script>

<header>
	<Heading tag='h2' customSize='text-4xl font-bold'>
		Account <span class='font-black text-blue-600'>
			settings
		</span>
	</Heading>
	<p class='my-4 text-slate-500'>
		Write, edit and publish from here. You can also see your profile and set your overview.
	</p>
</header>

<main class='flex flex-col gap-16 xl:max-w-3xl'>
	<div class='flex flex-col gap-8'>
		<h3 class='text-xl font-semibold'>Change password</h3>
		<ChangePasswordForm />
	</div>

	<div class='pb-16'>
		<h3 class='text-xl font-semibold text-red-700 mb-4'>Danger zone</h3>
		<div class='border border-red-400 rounded-lg p-4'>
			<div class='flex flex-col md:flex-row md:items-center justify-between gap-6'>
				<div class='md:w-2/3'>
					<h3 class='font-semibold'>Delete account</h3>
					<p class='text-xs'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium culpa deserunt
						doloremque eveniet, fuga
						ipsum iusto laboriosam minus necessitatibus obcaecati odio placeat quae quaerat, soluta tempore tenetur
						velit
						vero voluptatibus?
					</p>
				</div>
				<div>
					<Button color='red'>Delete account</Button>
				</div>
			</div>
		</div>
	</div>
</main>
