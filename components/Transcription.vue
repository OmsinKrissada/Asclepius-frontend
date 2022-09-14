<script setup lang=ts>
const props = defineProps<{
	transcription: string[];
}>();

const output = computed(() => props.transcription.join(' '));
</script>

<template>
	<div class="m-5 p-5 bg-white rounded shadow-md">
		<div class="mb-3">
			<h3 class="font-fahkwang font-bold">Transcription</h3>
			<div class="w-full h-0.5 mt-1 bg-sky-600 rounded" />
		</div>
		<div class="w-96 max-h-60 font-inter font-medium overflow-x-clip overflow-y-auto">
			{{output}}
		</div>
	</div>
</template>