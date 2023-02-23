<script lang="ts">
	import { Heading, P } from 'flowbite-svelte'
</script>

<header>
	<Heading tag="h2" customSize="text-4xl font-extrabold">
		Write a new <span class="font-black text-primary-300">article</span>
	</Heading>
	<p class="my-4 text-slate-500">
		Are you ready to write a new article? Setup main info and then you will be able to write!
	</p>
	<P class="mb-4">
		Setup main info such as title, description, targte and topics. An article should have a unique
		slug, so choose a good title beacuse the slug will be automatically generated from it.
	</P>
	<P class="mb-4">Remember that you can also edit main info later</P>
</header>
