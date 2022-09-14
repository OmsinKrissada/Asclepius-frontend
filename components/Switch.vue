<script setup lang="ts">
// import {  } from 'crypto-js';

defineProps<{
	modelValue: boolean;
}>();
defineEmits<{
	(e: 'update:modelValue', value: boolean);
}>();

const uuid = ref('');
onMounted(() => {
	uuid.value = crypto.randomUUID();
});

// function log(val) {
// 	console.log(val);
// }
</script>
<template>
	<label :for="uuid" class="inline-flex relative items-center cursor-pointer">
		<input type="checkbox" :checked="modelValue" @input="$emit('update:modelValue',($event.target as any).checked)"
			:id="uuid" class="sr-only peer">
		<div class="w-11 h-6
		    from-sky-600
			to-sky-400
			bg-sky-900
			rounded
			after:shadow-sm
			after:shadow-black
			peer-focus:outline-none
			peer peer-checked:after:left-[24px] 
			peer-checked:bg-gradient-to-r
			after:content-[''] after:absolute 
			after:top-[4px] after:left-[4px] after:bg-white after:rounded after:h-4 after:w-4 after:transition-all">
		</div>
		<span class="ml-3 font-medium text-gray-900">
			<slot />
		</span>
	</label>
</template>