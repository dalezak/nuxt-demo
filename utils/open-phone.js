export default async function (url) {
  if (process.client) {
    window.open(`tel:${telephone}`, "_blank");
  }
}