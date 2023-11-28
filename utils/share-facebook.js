export default function (title, description, image, url) {
  // window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURI(`${title} - ${description}`)}`, "_blank");
  const link = new URL("https://www.facebook.com/sharer/sharer.php");
  let body = [];
  if (url && url.length > 0) {
    link.searchParams.append("u", url);
  }
  if (title && title.length > 0) {
    body.push(title);
  }
  if (description && description.length > 0) {
    body.push(description);
  }
  if (body.length > 0) {
    link.searchParams.append("quote", body.join(" - "));
  }
  window.open(link.href, "_blank");
}