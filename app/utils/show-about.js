export default function () {
  if (process.client) {
    showPage("/about", false, true);
  }
}