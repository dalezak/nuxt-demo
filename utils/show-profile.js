export default function () {
  if (process.client) {
    showPage("/profile");
  }
}