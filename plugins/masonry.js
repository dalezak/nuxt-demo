import masonry from 'vue-next-masonry';
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(masonry);
})