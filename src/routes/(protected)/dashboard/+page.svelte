<script lang='ts'>
	import { Heading, P } from 'flowbite-svelte'
	import 'chart.js/auto'
	import { getNotificationsContext } from 'svelte-notifications'

	import { BetaReleaseAlert, CardCTA } from '@protected/components/dashboard-features'
	import { callToActions } from './config'

	const { addNotification } = getNotificationsContext()
</script>

<header>
	<Heading tag='h2' customSize='text-4xl font-bold'>
		Welcome to <span class='font-black text-blue-600'>
			Author Panel
		</span>
	</Heading>
	<p class='my-4 text-slate-500'>
		Write, edit and publish from here. You can also see your profile and set your overview.
	</p>
	<P class='mb-4'>
		This panel was developed to help you managing your profile and your articles. You can see some
		analysis based on your created content and you can write your articles here. Then a reviewer
		will check what you do and your article will be published! So smart!
	</P>
</header>

<main class='flex flex-col space-y-8'>
	<BetaReleaseAlert />
	<div class='flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8'>
		{#each callToActions as cta}
			<CardCTA props={cta.props}>
				<p class='text-sm text-slate-50'>
					{cta.action}
					<span class='block font-semibold'>{cta.promo}</span>
				</p>
			</CardCTA>
		{/each}
	</div>
</main>
