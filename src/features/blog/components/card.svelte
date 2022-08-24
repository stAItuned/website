<script lang="ts">
	import type { ArticleMeta } from '@lib/notion'

	export let articleMeta: ArticleMeta

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


  <div class="d-flex m-4 max-w-xs">
	<Card class="w-max">
		<a class="text-3xl" href="/learn/{articleMeta.slug}">
			<img src="assets/general/bg-1.jpeg" alt="background" class="max-w-xs h-auto "/>
		
			<div class="h-72">
				<p class="text-bold text-sm p-4 pb-0 uppercase">{articleMeta.tags[0]}</p>
				<p class="text-bold text-md text-bold pl-4 pb-4 pt-0">{articleMeta.title}</p>

				<p class="text-bold text-sm text-left text-bold pl-4 pb-4 pt-0">{articleMeta.meta}</p>
			</div>
		</a>
		
	  	<hr />
	  
		<div class="flex p-2 max-h-12">
				<div class="pr-4">
					<img src="assets/general/avatar.png" alt="avatar" class="max-h-8"/>
				</div>
				<div class="grid grod-cols-1 p-0">
					<span><p class="flex text-xs mb-0">{articleMeta.author}</p></span>
					<span><p class="flex text-xs">{articleMeta.publishDate}</p></span>
				</div>
		</div>
	</Card>
  </div>




<!-- 
<a class="text-3xl" href="/learn/{articleMeta.slug}">
	<div
		class="flex flex-col rounded-md shadow-lg hover:cursor-pointer w-[400px] h-[450px] bg-bgLearnCard bg-no-repeat bg-[length:200%_200%] bg-center"
	>
		<div class="h-[calc(40%+100px)] mt-auto">
			<div class="h-[100px] w-[50px] rounded-bl-[50px] shadow-[0_50px_0_0_#FFF272]" />
			<div
				class="w-full h-[calc(100%-100px)] p-4 rounded-tr-[50px] bg-stayYellow-500 self-start flex flex-col gap-1 text-lg"
			>
				<p class="font-bold">
					{articleMeta.title}
				</p>
				<span class="flex gap-2">
					<p class=" font-bold">Author:</p>
					<p class="">
						{articleMeta.author}
					</p>
				</span>

				<p class="text-lg">
					{articleMeta.publishDate}
				</p>
				<p class="text-lg">5 min</p>
			</div>
		</div>
	</div>
</a> -->