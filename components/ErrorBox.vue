<script setup lang="ts">
defineProps<{
	message: string;
}>();

function reload() {
	location.reload();
}
</script>


<template>
	<div v-if="message">
		<p class="m-2 text-3xl text-center font-mitr">{{ message }}</p>
		<p class="m-5 text-lg text-center font-inter">Press reload if you think the problem is fixed.</p>
		<button @click="reload"
			class="block mx-auto mt-10 px-8 py-3 rounded-lg bg-teal-500 font-fahkwang text-white shadow-xl shadow-teal-300/30 hover:shadow-teal-600/40 hover:bg-teal-600 transition-all">
			RELOAD NOW
		</button>
	</div>
</template>