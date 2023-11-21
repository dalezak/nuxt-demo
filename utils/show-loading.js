import { loadingController } from "@ionic/vue";
export default async function (message = "Loading...", hide = 0) {
  if (process.client) {
    if (window.loading) {
      window.loading.message = message;
    }
    else {
      window.loading = await loadingController.create({
        message: message
      });
      await window.loading.present();
    }
    if (hide && hide > 0) {
      hideLoading(hide);
    }
    return window.loading;
  }
  return null;
}