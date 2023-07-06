<script lang='ts'>
	import cn from 'classnames'
	import { Badge } from 'flowbite-svelte'

	import type { CardCTAProps } from './types'

	export let props: CardCTAProps
	const { label, title, href, variant = 'purpleToIndigo' } = props

	const theme = cn({
		'from-primary-700 to-primary-400 shadow-primary-500/50': variant === 'primary',
		'from-purple-800 to-rose-600 shadow-rose-300/50': variant === 'purpleToRose',
		'from-purple-800 to-indigo-600 shadow-purple-400/50': variant === 'purpleToIndigo'
	}, 'h-56 w-full px-4 py-6 bg-gradient-to-br shadow-lg text-white rounded-lg hover:scale-105 transition', $$props.class)
</script>

<a {href} class={theme}>
	<Badge color='purple' class='!font-bold mb-4'>{label}</Badge>
	<h3 class='text-xl font-bold mb-3'>{title}</h3>
	<slot />
</a>