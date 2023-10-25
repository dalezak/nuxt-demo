// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { 
    enabled: true 
  },
  css: [
    '~/assets/css/ionic.css'
  ],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/ionic'
  ],
  runtimeConfig: {
    public: {
    },
  },
  ionic: {
    integrations: {
      icons: true,
    },
  },
})
