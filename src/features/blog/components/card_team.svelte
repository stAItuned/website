<script lang="ts">
	import {
		Card,
		CardTitle,
		CardSubtitle,
		CardActions,
		Button,
		Icon,
		Divider,
		MaterialApp
	} from 'svelte-materialify'
	import { slide } from 'svelte/transition'

	let active = false
	function toggle() {
		active = !active
	}

	import type { Author } from '@lib/git/types'
	// export let articleMeta: ArticleMeta
	export let author: Author
</script>

<div class="flex flex-col items-center justify-between space-y-6">
	<img src={author.propic} alt="avatar" class="w-auto h-48 rounded-full" />
	<div class="text-center">
		<h3 class="font-bold text-xl">{author.name}</h3>
		<p class="text-md m-0">{author.title}</p>
	</div>

	<div class="flex space-x-2">
		<a href={author.linkedin} target="_blank">
			<img src="../assets/general/linkedin.png" alt="avatar" class="h-10" />
		</a>
		<a href="mailto:{author.email}" target="_blank">
			<img src="../assets/general/email.png" alt="avatar" class="h-10" />
		</a>
	</div>
</div>
