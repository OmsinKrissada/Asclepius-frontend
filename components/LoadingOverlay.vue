<script setup lang="ts">
const props = defineProps<{
	message: string;
}>();
// if(props.visible==undefined)props.visible=true;
const display = ref(true);
// setInterval(() => props.visible = !props.visible, 5000);
const previousMessage = ref('');
const visible = computed(() => props.message != '');
watch(() => props.message, () => {
	const visible = props.message != '';
	if (visible) {
		display.value = true;
		previousMessage.value = props.message;
	} else setTimeout(() => {
		display.value = visible;
	}, 150);
});
</script>
<template>
	<div v-if="display"
		class="transition-opacity z-50 fixed flex flex-col space-y-5 justify-center items-center w-screen h-screen inset-0 bg-black/60 backdrop-blur-lg"
		:style="{opacity:visible?1:0}" :uh="display">
		<p class="text-white text-2xl">Getting things ready for you</p>
		<div class="relative group w-fit h-fit p-1.5 mx-auto overflow-hidden rounded-lg">
			<div
				class="absolute -inset-28 bg-gradient-to-br from-green-400 to-blue-600 transition animate-[spinny_1000ms_linear_infinite]">
			</div>
			<div class="relative m-auto px-4 py-3 bg-white font-medium text-xl rounded-lg">{{message||previousMessage}}
			</div>
		</div>
	</div>
</template>

<style>
@keyframes spinny {
	from {
		transform: scale3d(2, 2, 1) rotateZ(0deg);
	}

	to {
		transform: scale3d(2, 2, 1) rotateZ(360deg);
	}
}
</style>