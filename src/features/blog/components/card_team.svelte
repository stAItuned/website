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

  import type { Author } from '@lib/git/types'
	// export let articleMeta: ArticleMeta
	export let author: Author

</script>


  <div class="d-flex m-4 max-w-xs ">
	<div class="w-max color-white">

		<img src="{author.propic}" alt="avatar" class="w-auto h-48 rounded-full"/>
	
		<p class="text-bold text-xl p-4 pb-0 ">{author.name}</p>

    <center>
      <div class="center">
		    <p class="text-bold text-md text-bold pt-0">{author.title}</p> 
      </div>  
    </center>
    
    <center>
      <div class="h-10 grid grid-cols-2">
          <a href="{author.linkedin}" target="_blank"><img src="../assets/general/linkedin.png" alt="avatar" class="h-10 justify-self-end mr-1"/></a>
          <a href="mailto:{author.email}" target="_blank"><img src="../assets/general/email.png" alt="avatar" class="h-10 justify-self-start ml-1"/></a>
      </div>
    </center>
	</div>
  </div>

