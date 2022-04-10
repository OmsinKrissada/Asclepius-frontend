<!-- Please remove this file from your project -->
<template>
	<div class="relative flex justify-between items-center p-5 bg-blue text-white h-16 shadow-lg">
		<nuxt-link to="/">
			<div class="flex items-center cursor-pointer">
				<img src="/logo.png" alt="" class="h-16 w-16" />
				<h1 class="font-krub font-bold hidden sm:block">ASCLEPIUS</h1>
			</div>
		</nuxt-link>
		<div class="flex items-center">
			<!-- <button class="m-2 px-3 py-1 font-krub">English</button> -->

			<nuxt-link to="/how_it_works">
				<button class="m-2 px-3 py-1 mdi mdi-help-circle-outline text-3xl" />
			</nuxt-link>
			<!-- <button class="m-2 px-3 py-1 mdi mdi-menu mdi-close text-3xl" /> -->
		</div>
	</div>
</template>

<script>
export default {
	name: "NuxtTutorial",
};
</script>
