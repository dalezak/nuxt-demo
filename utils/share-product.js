export default function (product, event = null) {
  shareSocial({
    title: product.title, 
    description: product.description
  }, event);
}