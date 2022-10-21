<script lang="ts">
	import type { Author } from '@lib/interfaces'

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
			<!-- <img src={LinkedIn} alt="linkedin" class="h-10" /> -->
			<div class="bg-sky-800 rounded-full h-full w-full text-white p-3">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 448 512"
					fill="currentColor"
					class="w-5 h-5"
				>
					<path
						d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
					/>
				</svg>
			</div>
		</a>
		<a href="mailto:{author.email}" target="_blank">
			<!-- <img src={Email} alt="email" class="h-10" /> -->
			<div class="bg-primary-600 rounded-full h-full w-full text-white p-3">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="w-5 h-5"
				>
					<path
						d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"
					/>
					<path
						d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"
					/>
				</svg>
			</div>
		</a>
	</div>
</div>
