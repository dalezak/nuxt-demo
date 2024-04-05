export default function () {
  if (process.client) {
    showPage("/profile", false, true);
  }
}