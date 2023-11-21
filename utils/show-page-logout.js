export default function () {
  if (process.client) {
    showPage("/logout", false);
  }
}