export default async function (delay = 200) {
  if (process.client) {
    setTimeout(async() => {
      if (window.loading) {
        await window.loading.dismiss();
        window.loading = null;
      }
    }, delay);
  }
}