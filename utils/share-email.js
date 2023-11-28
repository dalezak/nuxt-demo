export default function (title, description, image, url) {
  // window.open(`mailto:?subject=${encodeURI(title)}&body=${encodeURI(description + "\n" + url)}`, "_blank"); 
  const params = {};
  if (title && title.length > 0) {
    params["subject"] = encodeURI(title);
  }
  let body = [];
  if (description && description.length > 0) {
    body.push(description);
  }
  if (image && image.length > 0) {
    body.push(image);
  }
  if (url && url.length > 0) {
    body.push(url);
  }
  if (body.length > 0) {
    params["body"] = encodeURI(body.join("\n\n"));
  }
  const query = Object.keys(params).map(key => key + '=' + params[key]).join('&');
  window.open(`mailto:?${query}`, "_blank");
}