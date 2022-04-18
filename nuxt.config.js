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
      { hid: 'og-image', property: 'og:image', content: '/logo.png' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
      { href: 'https://fonts.googleapis.com/css2?family=Krub&display=swap', rel: 'stylesheet' },
      { href: 'https://fonts.googleapis.com/css2?family=Mitr&display=swap', rel: 'stylesheet' },
      { href: 'https://fonts.googleapis.com/css2?family=Fahkwang&display=swap', rel: 'stylesheet' },
      { href: 'https://fonts.googleapis.com/css2?family=Inter&display=swap', rel: 'stylesheet' },
    ]
  },

  target: 'static',

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@mdi/font/css/materialdesignicons.css',
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
    '@nuxtjs/toast',
    '@nuxtjs/tailwindcss',
    'nuxt-socket-io',
    // '@nuxtjs/partytown',

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

  io: {
    // module options
    sockets: [{
      name: 'main',
      url: `${process.env.WS_HOST}:${process.env.WS_PORT || ''}`,
      default: true,

    }]
  },

  // styleResources: {
  //   scss: ['./assets/*.scss']
  // },

  publicRuntimeConfig: {
    wsHost: process.env.WS_HOST,
    wsPort: process.env.WS_PORT,
    wsPath: process.env.WS_PATH,
  },
};
