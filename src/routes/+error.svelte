<script lang="ts">
	import { Button, PageTransition } from '@components/ui-core'
</script>

<PageTransition>
	<section class="text-center space-y-6 mt-[270px] mb-16">
		<div class="space-y-0">
			<h1 class="text-xl font-semibold">Oops... Something went wrong</h1>
			<p>Looks like there's been a mistake, either on your side or on our side. We're sorry :(</p>
		</div>

		<div>
			<a href="/">
				<Button variant="primary" rounded="lg" width="fit">Go back to the homepage</Button>
			</a>
		</div>
	</section>
</PageTransition>
