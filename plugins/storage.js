import { Storage } from '../services/storage';
export default defineNuxtPlugin(nuxtApp => {
  const storage = new Storage();
  nuxtApp.provide('storage', storage);
})