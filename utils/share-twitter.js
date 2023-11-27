export default function (title, description, url) {
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${encodeURI(`${title} - ${description}`)}`, "_blank");
}