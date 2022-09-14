<script setup lang="ts">
defineProps<{
	label: string;
	options: { name: string; value: string; }[];
}>();
defineEmits<{
	(e: 'change', value: string);
}>();
</script>
<template>
	<div>
		<button id="dropdownDefault" data-dropdown-toggle="dropdown"
			class="text-white bg-fah-700 hover:bg-fah-800 focus:ring-4 focus:outline-none focus:ring-fah-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-fah-600 dark:hover:bg-fah-700 dark:focus:ring-fah-800"
			type="button">{{label}} <svg class="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor"
				viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
			</svg>
		</button>
		<!-- Dropdown menu -->
		<div id="dropdown" class="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
			<ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
				<li>
					<p v-for="option in options" @click="$emit('change',option.value)"
						class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
						{{option.name}}</p>
				</li>
			</ul>
		</div>
	</div>
</template>