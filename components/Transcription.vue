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
					<button
						class="w-8 h-8 bg-slate-500 font-medium font-inter text-2xl text-white rounded-md hover:shadow-lg shadow-black active:bg-slate-600"
						@click="zoomOut">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
							stroke="currentColor" class="w-6 h-6 mx-auto">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
						</svg>

					</button>
					<button
						class="w-8 h-8 bg-slate-500 font-medium font-inter text-2xl text-white rounded-md hover:shadow-lg shadow-black active:bg-slate-600"
						@click="zoomIn">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
							stroke="currentColor" class="w-6 h-6 mx-auto">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
						</svg>

					</button>
				</div>
			</div>
			<div class="w-full h-0.5 mt-1 bg-sky-600 rounded" />
		</div>
		<div class="w-96 max-h-60 font-inter font-medium break-words overflow-y-auto"
			:style="{ 'font-size': `${textSize}rem` }">
			{{ output || 'Waiting for translation...' }}
		</div>
	</div>
</template>