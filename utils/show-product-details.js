export default function (product_id) {
  if (process.client) {
    showPage(`/products/${product_id}`);
  }
}