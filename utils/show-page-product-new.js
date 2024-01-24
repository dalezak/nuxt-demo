import ProductNew from '~/pages/tabs/products/new.vue';
export default async function () {
  if (process.client) {
    return await showModal(ProductNew);
  }
  return null;
}