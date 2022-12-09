// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	app: {
		head: {
			title: 'ASCLEPIUS | ASL to Text',
			meta: [
				{ name: 'description', content: 'Easily communicate with person having hearing or speech disability.' }
			]
		}
	},
	modules: ["@nuxtjs/google-fonts", "@vueuse/nuxt"],
	css: ['~/assets/css/main.css'],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	googleFonts: {
		families: {
			Krub: true,
			Mitr: true,
			Inter: [400, 500, 600, 700],
		},
	},
	runtimeConfig: {
		public: {
			wsHost: "",
			wsPort: "",
			wsPath: "",
		},
	},
	builder: 'webpack',
	// vite: {
	// 	optimizeDeps: {
	// 		include: [
	// 			"node_modules/@mediapipe/holistic",
	// 			"node_modules/@mediapipe/holistic/holistic.js",
	// 			"node_modules/@mediapipe/holistic/holistic_solution_packed_assets_loader.js",
	// 			"node_modules/@mediapipe/holistic/holistic_solution_packed_assets.data",
	// 			"node_modules/@mediapipe/holistic/holistic_solution_simd_wasm_bin.data",
	// 			"node_modules/@mediapipe/holistic/holistic_solution_simd_wasm_bin.js",
	// 			"node_modules/@mediapipe/holistic/holistic_solution_simd_wasm_bin.wasm",
	// 			"node_modules/@mediapipe/holistic/holistic_solution_wasm_bin.js",
	// 			"node_modules/@mediapipe/holistic/holistic_solution_wasm_bin.wasm",
	// 			"node_modules/@mediapipe/holistic/pose_landmark_full.tflite",
	// 			"node_modules/@mediapipe/holistic/pose_landmark_heavy.tflite",
	// 			"node_modules/@mediapipe/holistic/pose_landmark_lite.tflite",
	// 			"node_modules/@mediapipe/holistic/holistic.binarypb",
	// 			"node_modules/@mediapipe/hands",
	// 			"node_modules/@mediapipe/camera_utils",
	// 			"node_modules/@mediapipe/drawing_utils",
	// 			"node_modules/@mediapipe/holistic",
	// 			"@mediapipe/holistic/holistic.js",
	// 			"@mediapipe/holistic/holistic_solution_packed_assets_loader.js",
	// 			"@mediapipe/holistic/holistic_solution_packed_assets.data",
	// 			"@mediapipe/holistic/holistic_solution_simd_wasm_bin.data",
	// 			"@mediapipe/holistic/holistic_solution_simd_wasm_bin.js",
	// 			"@mediapipe/holistic/holistic_solution_simd_wasm_bin.wasm",
	// 			"@mediapipe/holistic/holistic_solution_wasm_bin.js",
	// 			"@mediapipe/holistic/holistic_solution_wasm_bin.wasm",
	// 			"@mediapipe/holistic/pose_landmark_full.tflite",
	// 			"@mediapipe/holistic/pose_landmark_heavy.tflite",
	// 			"@mediapipe/holistic/pose_landmark_lite.tflite",
	// 			"@mediapipe/holistic/holistic.binarypb",
	// 			"@mediapipe/hands",
	// 			"@mediapipe/camera_utils",
	// 			"@mediapipe/drawing_utils",
	// 		],
	// 		force: true,
	// 	},
	// 	build: {
	// 		minify: false,

	// 		// commonjsOptions:{
	// 		// 	in
	// 		// }
	// 	},
	// },
});
