// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import packageJson from './package.json';
const __dirname = dirname(fileURLToPath(import.meta.url));
export default defineNuxtConfig({
  srcDir: 'app',
  compatibilityDate: '2026-04-03',
  ssr: true,
  debug: false,
  devtools: { 
    enabled: true 
  },
  extends: [
    '../nuxt-ionic',
    '../nuxt-supabase'
  ],
  modules: [],
  supabase: {
    types: resolve(__dirname, '../nuxt-supabase/app/types/database.types.ts')
  },
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
      'app/stores/**',
      '../nuxt-supabase/stores/**',
      '../nuxt-ionic/stores/**'
    ]
  }
})
