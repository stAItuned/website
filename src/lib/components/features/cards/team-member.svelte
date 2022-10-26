<script lang="ts">
	import type { Author } from '@lib/interfaces'

	import { Icons } from '@components/ui-core'

	export let author: Author
</script>

<div
	class="w-full md:w-1/2 lg:w-1/3 xl:w-1/5 p-8 flex flex-col items-center justify-between space-y-6"
>
	<img src={author.propic} alt="avatar" class="w-auto h-48 rounded-full" />
	<div class="text-center">
		<h3 class="font-bold text-xl">{author.name}</h3>
		<p class="text-md m-0">{author.title}</p>
	</div>

	<div class="flex space-x-2">
		<a href={author.linkedin} target="_blank">
			<div class="bg-sky-800 rounded-full h-full w-full text-white p-3">
				<Icons.Brands.LinkedIn class="h-5 w-5" />
			</div>
		</a>
		<a href="mailto:{author.email}" target="_blank">
			<div class="bg-primary-600 rounded-full h-full w-full text-white p-3">
				<Icons.Mail class="h-5 w-5" />
			</div>
		</a>
	</div>
</div>
