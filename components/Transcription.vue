<script setup lang=ts>
const props = defineProps<{
	transcription: string[];
}>();

const output = computed(() => props.transcription.join(' '));
const textSize = ref(1);

function zoomIn() {
	textSize.value += 0.1;
}
// const zoomIn = () => 
const zoomOut = () => textSize.value -= 0.1;
</script>

<template>
	<div class="m-5 p-5 bg-white rounded shadow-md">
		<div class="mb-3">
			<div class="flex justify-between items-center">
				<h3 class="font-fahkwang font-bold">Transcription</h3>
				<div class="flex space-x-1 border-separate border-black border-spacing-3">
					<button class="w-8 h-8 bg-slate-400 font-medium font-inter text-2xl text-white rounded-md"
						@click="zoomIn">
						+
					</button>
					<button class="w-8 h-8 bg-slate-400 font-medium font-inter text-2xl text-white rounded-md"
						@click="zoomOut">
						-
					</button>
				</div>
			</div>
			<div class="w-full h-0.5 mt-1 bg-sky-600 rounded" />
		</div>
		<div class="w-96 max-h-60 font-inter font-medium overflow-x-clip overflow-y-auto"
			:style="{'font-size':`${textSize}rem`}">
			{{output}}
		</div>
	</div>
</template>