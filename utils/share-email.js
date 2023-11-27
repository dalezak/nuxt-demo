export default function (title, description, url) {
  window.open(`mailto:?subject=${encodeURI(title)}&body=${encodeURI(description + "\n" + url)}`, "_blank"); 
}