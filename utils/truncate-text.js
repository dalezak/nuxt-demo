export default function (text, length = 100, clamp = "...") {
  if (text.length > length) {
    return text.substring(0, length) + clamp;
  } 
  else {
    return text;
  }
}