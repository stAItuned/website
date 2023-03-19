<script lang='ts'>
	import { Alert } from 'flowbite-svelte'
	import { InformationCircle } from 'svelte-heros-v2'
</script>

<Alert dismissable class='mb-6'>
    <span slot='icon'>
			<InformationCircle variation='solid' />
    </span>
	<p>Note that this is a beta release, so please let us know of any problems you encounter or leave feedback to
		improve or request any features.</p>
	<a href='/feedback' class='font-semibold underline hover:text-blue-800 dark:hover:text-blue-900'>
		Give a feedback
	</a>.
</Alert>