<script lang="ts">

	import {
    Card,
    CardTitle,
    CardSubtitle,
    CardActions,
    Button,
    Icon,
    Divider,
    MaterialApp } from 'svelte-materialify';
  import { slide } from 'svelte/transition';


  let active = false;
  function toggle() {
    active = !active;
  }
</script>


  <div class="d-flex m-4 max-w-xs ">
	<div class="w-max h-auto color-white">

		<img src="../assets/general/avatar.png" alt="avatar" class="max-w-xs h-64 "/>
	
		<p class="text-bold text-xl p-4 pb-0 ">Name and Surname</p>
		<p class="text-bold text-md text-bold pt-0">Role</p> 
		
		<div class="h-10 grid grid-cols-2">
				<a href="/"><img src="../assets/general/linkedin.png" alt="avatar" class="h-10 justify-self-end mr-1"/></a>
				<a href="/"><img src="../assets/general/email.png" alt="avatar" class="h-10 justify-self-start ml-1"/></a>
		</div>
	</div>
  </div>

