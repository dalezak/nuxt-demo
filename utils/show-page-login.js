export default function () {
  if (process.client) {
    showPage("/login", false);
  }
}