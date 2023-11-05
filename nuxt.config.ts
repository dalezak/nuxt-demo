// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  devtools: { 
    enabled: true 
  },
  css: [
    '@/assets/css/theme.css',
    '@/assets/css/transition.css'
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
      meta: true,
      pwa: true,
      icons: true,
      router: true
    },
    css: {
      core: true,
      basic: true,
      utilities: true      
    }
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
  }
})
