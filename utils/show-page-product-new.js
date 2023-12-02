import ProductNew from '~/pages/root/products/new.vue';
export default async function () {
  if (process.client) {
    return await showModal(ProductNew);
  }
  return null;
}