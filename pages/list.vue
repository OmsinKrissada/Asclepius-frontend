<script setup lang="ts">
const { data, pending, error, refresh } = await useAsyncData(
	'wordlist',
	() => $fetch('https://asclepiusapi.spaceac.net/wordlist')
);
</script>

<template>
	<div class="sm:w-2/3 mx-auto px-4">
		<h1 class="my-8 font-medium font-inter text-3xl text-center">Available Words</h1>

		<h2
			class="px-3 py-2 bg-gradient-to-r from-emerald-400 to-sky-500 font-medium text-center text-white rounded transition-shadow shadow-black/50">
			WORD
		</h2>
		<ul class="grid grid-cols-1 sm:grid-cols-5 my-4 gap-5 font-mono text-center">
			<li v-for="word in data['word']">{{ word }}</li>
		</ul>

		<h2
			class="px-3 py-2 bg-gradient-to-r from-emerald-400 to-sky-500 font-medium text-center text-white rounded transition-shadow shadow-black/50">
			ILLNESS
		</h2>
		<ul class="grid grid-cols-1 sm:grid-cols-5 my-4 gap-5 font-mono text-center">
			<li v-for="word in data['illness']">{{ word }}</li>
		</ul>

		<h2
			class="px-3 py-2 bg-gradient-to-r from-emerald-400 to-sky-500 font-medium text-center text-white rounded transition-shadow shadow-black/50">
			LETTER
		</h2>
		<p class="my-4 font-mono text-center">a - z</p>

		<h2
			class="px-3 py-2 bg-gradient-to-r from-emerald-400 to-sky-500 font-medium text-center text-white rounded transition-shadow shadow-black/50">
			NUMBER
		</h2>
		<p class="my-4 font-mono text-center">0 - 9</p>
	</div>
</template>