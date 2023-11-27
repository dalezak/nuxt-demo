export default function (title, description, url) {
  window.open(`http://pinterest.com/pin/create/button/?url=${url}&description=${encodeURI(`${title} - ${description}`)}`, "_blank");
}