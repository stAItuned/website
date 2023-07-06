<script lang='ts'>
	import { Button, Modal } from 'flowbite-svelte'
	import { user } from '@lib/stores'
	import { slide } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
</script>

{#if !$user.author.unlocked}
	<div>
		<Modal
			title='Complete your profile'
			size='lg'
			open={true} permanent transition={slide}
			params={{duration: 300, easing: quintOut}}
		>
			<p class='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
				Please complete your profile to continue and write your first article.
			</p>
			<p class='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
				It only takes a few seconds for the essential information and you will only need to provide a little information
				about yourself.
			</p>
			<svelte:fragment slot='footer'>
				<Button href='/profile/complete'>Complete now</Button>
				<Button href='/dashboard' color='alternative'>Later</Button>
			</svelte:fragment>
		</Modal>
	</div>
{/if}

<slot />
