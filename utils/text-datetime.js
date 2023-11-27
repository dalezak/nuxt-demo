export default function (text) {
  if (text) {
    let date = new Date(text);
    return date.toLocaleDateString('en-us', { 
      weekday: "long", 
      year: "numeric", 
      month: "short", 
      day: "numeric"
    });
  }
  return "";
}