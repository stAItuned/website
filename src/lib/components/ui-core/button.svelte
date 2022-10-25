<script lang="ts">
	import classnames from 'classnames'

	export let variant: 'primary' | 'secondary' | 'transparent' = 'primary'
	export let rounded: 'lg' | 'full' = 'lg'
	export let width: 'fit' | 'full' = 'fit'
	export let type: 'button' | 'submit' | 'reset' = 'button'
	export let onClick = () => {}
	export let className = ''

	const classes = classnames(
		{
			'p-4 transition': true,
			'w-full': width === 'full',
			'w-fit': width === 'fit',
			'rounded-full': rounded === 'full',
			'rounded-lg': rounded === 'lg',
			'bg-primary-600 hover:bg-primary-500 active:bg-primary-600 text-slate-100': variant === 'primary',
			'bg-secondary-600 hover:bg-secondary-500 active:bg-secondary-600 text-primary-500': variant === 'secondary',
			'hover:bg-slate-200 active:bg-slate-300 text-primary-500': variant === 'transparent'
		},
		className
	)
</script>

<button {type} on:click={onClick} class={classes}>
	<span class="font-semibold">
		<slot />
	</span>
</button>
