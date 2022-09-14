<template>
	<div class="flex-grow flex flex-col sm:flex-row justify-center items-center my-10">
		<div id="left" class="flex flex-col items-center">
			<p class="m-3 text-2xl" style="--order: 0">Welcome</p>
			<h2 id="name"
				class="m-3 font-mitr font-semibold text-blue-500 text-6xl drop-shadow-[-5px_3px_0px_lightblue]"
				style="--order: 1">
				ASCLEPIUS
			</h2>
			<!-- <img src="/logo.png" alt="logo" width="300" class="sm:hidden" /> -->
			<svg-logo class="sm:hidden w-screen h-fit px-8 " />
			<p class="m-3 text-center" style="--order: 2">
				Easily communicate with person having hearing or speech disability.
			</p>
			<nuxt-link to="/translate" style="--order: 3" class="m-3">
				<!-- shadow-[0_0_10px_rgba(0,0,0,0.2)] -->
				<!-- <button
					class="px-8 py-3 ring-4 ring-inset hover:ring-0 ring-teal-500 hover:from-teal-600 hover:to-green-500 bg-gradient-to-r font-fahkwang hover:text-white hover:shadow-xl hover:shadow-teal-500/40 rounded-md hover:rounded-lg transition-shadow"> -->
				<button
					class="px-8 py-3 from-teal-500 to-green-400 focus:from-teal-600 focus:to-green-500 bg-gradient-to-r font-[sans-serif] text-white shadow hover:shadow-lg hover:shadow-teal-500/40 rounded-lg transition-all">

					TRANSLATE
				</button>
			</nuxt-link>
			<!-- <Card text="WebSocket disconnected" /> -->
		</div>
		<!-- <img src="/logo.png" alt="logo" class="hidden sm:block" /> -->
		<svg-logo class="hidden sm:block" />
	</div>
</template>


<style scoped>
.toast {
	box-shadow: 0 1px 3px rgb(0 0 0 / 5%), rgb(0 0 0 / 5%) 0px 28px 23px -7px, rgb(0 0 0 / 4%) 0px 12px 12px -7px;
	background-color: black;
}

#left * {
	opacity: 0;

	animation: dropIn 1s forwards;
	animation-delay: calc(var(--order) * 100ms);
}

img {
	transform: translateY(0);
	animation: fadeIn 2s forwards;
}

@keyframes dropIn {
	0% {
		opacity: 0;
		transform: translateY(-100%);
	}

	100% {
		opacity: 1;
		transform: translateY(0px);
	}
}

@keyframes flyIn {
	0% {
		opacity: 0;
		transform: translateY(100%);
	}

	100% {
		opacity: 1;
		transform: translateY(0px);
	}
}

@keyframes fadeIn {
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}
</style>
