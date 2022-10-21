<script lang="ts">
	// @ts-ignore
	import techLogo from '../../assets/team/tech_large.svg?h=48?webp'
	// @ts-ignore
	import marketingLogo from '../../assets/team/marketing_large.svg?h=48?webp'
	// @ts-ignore
	import writersLogo from '../../assets/team/writers_large.svg?h=48?webp'

	import { Button, Breadcrumb, PageTransition } from '@features/ui-core'

	const TEAMS = [
		{ name: 'Tech', logo: techLogo },
		{ name: 'Marketing', logo: marketingLogo },
		{ name: 'Writers', logo: writersLogo }
	] as const
</script>

<PageTransition>
	<div class="max-w-7xl mx-auto mb-16 mt-[150px] px-8 space-y-24">
		<Breadcrumb />
		<section class="md:text-lg space-y-8">
			<div class="space-y-1">
				<p class="text-primary-600 font-bold m-0 mb-1 text-2xl">
					Have you always wanted to exchange opinions about AI practical applications?
				</p>
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
			<div class="space-y-1">
				<p class="font-bold text-primary-600 text-2xl m-0">
					But how many people do actually know what Artificial Intelligence is? And how many are
					familiar with its possible applications?
				</p>
				<p>Hence the idea to make everyone aware of AI potentialities in real life.</p>
			</div>
		</section>

		<!-- roadmap !! -->

		<section class="space-y-16">
			<h1 class="text-6xl font-bold text-primary-600 text-center uppercase">Our team</h1>
			<div class="flex flex-col md:flex-row gap-16 justify-center">
				{#each TEAMS as team}
					<a href={`/meet/${team.name.toLowerCase()}`}>
						<div
							class="flex flex-col space-y-8 opacity-50 hover:opacity-100 duration-500 transition"
						>
							<img
								srcset={team.logo}
								class="h-48 hover:scale-150 duration-500 transition"
								alt="tech"
							/>
							<Button variant="primary" rounded="full" className="w-1/2 md:w-full mx-auto">
								<span class="font-semibold text-2xl uppercase">{team.name}</span>
							</Button>
						</div>
					</a>
				{/each}
			</div>
		</section>
	</div>
</PageTransition>
