export default async function (url) {
  if (process.client) {
    window.open(`mailto:${email}`, "_blank");
  }
}