// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import packageJson from './package.json';
const currentDir = dirname(fileURLToPath(import.meta.url));
export default defineNuxtConfig({
  srcDir: join(currentDir, 'app'),
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
  modules: [
    '@pinia/nuxt'
  ],
  supabase: {
    types: join(currentDir, '../nuxt-supabase/app/types/database.types.ts')
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
  vite: {
    resolve: {
      dedupe: ['pinia', 'vue', '@ionic/vue']
    }
  },
  pinia: {
    storesDirs: [
      join(currentDir, 'app/stores/**'),
      join(currentDir, '../nuxt-ionic/app/stores/**')
    ]
  }
})
