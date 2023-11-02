// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  devtools: { 
    enabled: true 
  },
  css: [
    '~/assets/css/ionic.css'
  ],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/ionic',
    '@nuxtjs/supabase',
    '@pinia-plugin-persistedstate/nuxt'
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
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
  }
})
