<!-- Please remove this file from your project -->
<template>
	<div class="relative flex justify-between items-center p-5 bg-fah text-white h-16 shadow-lg">
		<nuxt-link to="/">
			<div class="flex items-center cursor-pointer">
				<svg-logo-no-text class="h-16 w-16 py-2" />
				<h1 class="font-krub font-bold hidden sm:block">ASCLEPIUS</h1>
			</div>
		</nuxt-link>
		<div class="flex items-center">
			<!-- <button class="m-2 px-3 py-1 font-krub">English</button> -->

			<!-- <nuxt-link to="/how_it_works">
				<button class="m-2 px-3 py-1 mdi mdi-help-circle-outline text-3xl" />
			</nuxt-link> -->
			<nuxt-link to="/list">
				<button class="m-2 px-3 py-1 mdi mdi-help-circle-outline text-3xl">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
						stroke="currentColor" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
					</svg>
				</button>
			</nuxt-link>
			<!-- <button class="m-2 px-3 py-1 mdi mdi-menu mdi-close text-3xl" /> -->
		</div>
	</div>
</template>
