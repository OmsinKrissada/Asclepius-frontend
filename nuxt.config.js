import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	modules: [
		"@nuxtjs/google-fonts",
		"@nuxtjs/tailwindcss",
		"@vueuse/nuxt"
	],
	googleFonts:{
		families:{
			Krub:true,
			Mitr:true,
			Inter:true,
		}
	},
	runtimeConfig:{
		public:{
			wsHost:'',
			wsPort:'',
			wsPath:'',
		}
	}
});
