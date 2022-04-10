export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'ASCLEPIUS',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'og-title', property: 'og:title', content: 'ASCLEPIUS - ASL TO ENGLISH' },
      { hid: 'og-desc', property: 'og:description', content: 'Easily communicate with person having hearing or speech disability.' },
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'og-image', property: 'og:image', content: 'https://asclepius.krissada.com/logo.png' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
      { href: 'https://fonts.googleapis.com/css2?family=Krub&display=swap', rel: 'stylesheet' },
      { href: 'https://fonts.googleapis.com/css2?family=Mitr&display=swap', rel: 'stylesheet' },
      { href: 'https://fonts.googleapis.com/css2?family=Fahkwang&display=swap', rel: 'stylesheet' },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~layouts/global.scss',
    '~assets/variables.scss',
    '@mdi/font/css/materialdesignicons.css'

  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    '@nuxtjs/toast',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss'

    // 'vue-web-cam/nuxt'
    // 'nuxt-material-design-icons'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/'
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  i18n: {
    locales: ['en', 'th'],
    strategy: 'no_prefix',
    defaultLocale: 'th',
    vueI18nLoader: true,
    vueI18n: {
      fallbackLocale: 'en'
    }
  },

  styleResources: {
    scss: ['./assets/*.scss']
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  publicRuntimeConfig: {
    wsHost: process.env.WS_HOST,
    wsPort: process.env.WS_PORT,
  },
};
