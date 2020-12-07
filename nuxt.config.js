const environment = process.env.NODE_ENV || 'development'
// eslint-disable-next-line @typescript-eslint/no-var-requires

const envSet =
  environment === 'development' ? require(`./env.${environment}.ts`) : {}

export default {
  ssr: false,
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'hiden-note',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  env: envSet,

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    {
      src: '~/node_modules/highlight.js/styles/atom-one-light.css',
      lang: 'css',
    },
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    ['bootstrap-vue/nuxt', { icons: true }],
    '@nuxtjs/markdownit',
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    babel: {
      babelrc: false,
      compact: false,
    },
  },
  router: {
    middleware: 'auth',
  },
}
