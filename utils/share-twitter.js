export default function (title, description, image, url) {
  // window.open(`https://twitter.com/intent/tweet?url=${url}&text=${encodeURI(`${title} - ${description}`)}`, "_blank");
  const link = new URL("https://twitter.com/intent/tweet");
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
    link.searchParams.append("text", body.join(" - "));
  }
  window.open(link.href, "_blank");
}