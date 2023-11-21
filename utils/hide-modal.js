import { modalController } from "@ionic/vue";
export default async function (data = null) {
  if (process.client) {
    await modalController.dismiss(data);
  }
}