import { toastController } from "@ionic/vue";
export default async function (message, seconds = 2) {
  if (process.client) {
    const toast = await toastController.create({
      message: message,
      duration: seconds * 1000
    });
    toast.present();
    return toast;
  }
  return null;
}