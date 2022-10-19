<script lang="ts">
	import LinkedIn from '../../../assets/general/linkedin.png'
	import Email from '../../../assets/general/email.png'

	import type { Author } from '@lib/git/types'

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
			<img src={LinkedIn} alt="linkedin" class="h-10" />
		</a>
		<a href="mailto:{author.email}" target="_blank">
			<img src={Email} alt="email" class="h-10" />
		</a>
	</div>
</div>
