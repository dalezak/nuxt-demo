// https://nuxt.com/docs/api/configuration/nuxt-config
import packageJson from './package.json';
export default defineNuxtConfig({
  ssr: true,
  debug: false,
  devtools: { 
    enabled: true 
  },
  extends: [
    'github:dalezak/nuxt-ionic'
  ],
  modules: [],
  runtimeConfig: {
    public: {
      url: process.env.APP_URL,
      app: {
        name: packageJson.name,
        version: packageJson.version
      }
    }
  },
  pinia: {
    storesDirs: [
      'stores/**',
      '../nuxt-supabase/stores/**',
      '../nuxt-ionic/stores/**'
    ]
  }
})
