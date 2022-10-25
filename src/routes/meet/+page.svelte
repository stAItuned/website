<script lang="ts">
	// @ts-ignore
	import techLogo from '@assets/team/tech_large.svg?h=512?webp'
	// @ts-ignore
	import marketingLogo from '@assets/team/marketing_large.svg?h=512?webp'
	// @ts-ignore
	import writersLogo from '@assets/team/writers_large.svg?h=512?webp'

	import { page } from '$app/stores'
	import { utils } from '@lib/helpers'

	import { Breadcrumb, PageTransition } from '@components/ui-core'
	import { Cards } from '@components/features'

	const pathname = $page.url.pathname

	const TEAMS = [
		{ name: 'Tech', logo: techLogo },
		{ name: 'Marketing', logo: marketingLogo },
		{ name: 'Writers', logo: writersLogo }
	] as const
</script>

<PageTransition>
	<div class="max-w-7xl mx-auto mb-32 mt-[150px] px-8 xl:px-4 space-y-16">
		<Breadcrumb tabs={utils.getTabsFromPathname(pathname)} />
		<section class="text-primary-600 md:text-lg space-y-8">
			<div class="space-y-2">
				<h3 class="font-bold text-2xl">
					Have you always wanted to exchange opinions about AI practical applications?
				</h3>
				<p>Then you’re in the right place.</p>
			</div>

			<div class="space-y-2">
				<p>
					In January 2022, after years of university spent wishing to find a space for sharing
					ideas, we wondered if it was the right time for us to create an AI community to share
					knowledge. As a consequence, stAI tuned was created: an open community in which everyone
					can share their knowledge, research projects and insights related to the AI topic.
				</p>
				<p>
					After the beginning of the project we realized that it’s very common to hear conversations
					about Artificial Intelligence in many contexts, like work, television, with friends and so
					on.
				</p>
			</div>
			<div class="space-y-2">
				<h3 class="font-bold text-2xl">
					But how many people do actually know what Artificial Intelligence is? And how many are
					familiar with its possible applications?
				</h3>
				<p>Hence the idea to make everyone aware of AI potentialities in real life.</p>
			</div>
		</section>

		<!-- roadmap !! -->

		<section class="space-y-16">
			<h1 class="text-6xl font-bold text-primary-600 text-center uppercase">Our team</h1>
			<div class="flex flex-col md:flex-row gap-16 justify-center">
				{#each TEAMS as team}
					<Cards.Team {team} />
				{/each}
			</div>
		</section>
	</div>
</PageTransition>
