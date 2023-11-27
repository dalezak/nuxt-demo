export default function (text) {
  if (text) {
    return text.replace(/\p{L}+/gu, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
  return "";
}