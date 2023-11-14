// https://nuxt.com/docs/api/configuration/nuxt-config
import packageJson from './package.json';
export default defineNuxtConfig({
  ssr: true,
  debug: true,
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
    '@nuxtjs/device',
    '@nuxtjs/supabase'
  ],
  plugins: [
    '@/plugins/masonry.js',
    '@/plugins/storage.js'
  ],
  runtimeConfig: {
    public: {
      app: {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description
      }
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
    key: process.env.SUPABASE_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: [],
    }
  }
})
