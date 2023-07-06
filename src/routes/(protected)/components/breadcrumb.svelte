<script lang='ts'>
	import { page } from '$app/stores'
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte'

	interface Item {
		label: string,
		href?: string
	}

	let breadcrumb: Item[]

	page.subscribe(({ url }) => {
		const { pathname } = url
		breadcrumb = [
			{ label: 'Dashboard', href: '/dashboard' },
			...pathname.split('/').filter(v => v.length > 0 && v !== 'dashboard')
				.map((path, idx, paths) => {
					const href = idx !== paths.length - 1 ? '/' + paths.slice(0, idx + 1).join('/') : undefined
					return { label: (path[0].toUpperCase() + path.slice(1)).replaceAll('-', ' '), href }
				})
		]
	})
</script>

<div class=''>
	<Breadcrumb>
		{#each breadcrumb as item, idx}
			<BreadcrumbItem href={item.href} home={idx === 0}>{item.label}</BreadcrumbItem>
		{/each}
	</Breadcrumb>
</div>
