import { Storage } from '../services/storage';
export default defineNuxtPlugin(nuxtApp => {
  console.log("plugins/storage", process.client ? "client" : "server");
  const storage = new Storage();
  nuxtApp.provide('storage', storage);
})