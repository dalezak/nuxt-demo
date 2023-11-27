export default function (title, description, url) {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURI(`${title} - ${description}`)}`, "_blank");
}