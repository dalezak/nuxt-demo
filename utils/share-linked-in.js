export default function (title, description, url) {
  window.open(`http://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURI(`${title} - ${description}`)}`, "_blank");
}