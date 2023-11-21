export default async function (selector) {
  if (process.client) {
    let element = document.querySelector(selector);
      return element && element.offsetParent != null;
  }
  return false;
}