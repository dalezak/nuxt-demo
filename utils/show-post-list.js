export default function () {
  if (process.client) {
    showPage("/posts", false, true);
  }
}