export default async function (url) {
  if (process.client) {
    if (url.startsWith("mailto:")) {
      window.open(url, "_blank");
    }
    else if (url.startsWith("tel:")) {
      window.open(url, "_blank");
    }
    else if (url.startsWith("http")) {
      window.open(url, "_blank");
    }
    else {
      window.open("http://" + url, "_blank");
    }
  }
}