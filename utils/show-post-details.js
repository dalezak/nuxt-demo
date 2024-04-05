export default function (post_id) {
  if (process.client) {
    showPage(`/posts/${post_id}`);
  }
}