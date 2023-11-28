export default function (title, description, image, url) {
  // window.open(`http://pinterest.com/pin/create/button/?url=${url}&description=${encodeURI(`${title} - ${description}`)}`, "_blank");
  const link = new URL("http://pinterest.com/pin/create/button/");
  let body = [];
  if (url && url.length > 0) {
    link.searchParams.append("url", url);
  }
  if (title && title.length > 0) {
    body.push(title);
  }
  if (description && description.length > 0) {
    body.push(description);
  }
  if (body.length > 0) {
    link.searchParams.append("description", body.join(" - "));
  }
  window.open(link.href, "_blank");
}