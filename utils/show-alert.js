import { alertController } from "@ionic/vue";
export default async function (title, subtitle = null, message = null, buttons = ["Ok"]) {
  if (process.client) {
    let alert = await alertController.create({
      header: title ? title : null,
      subHeader: subtitle ? subtitle : null,
      message: message ? message : null,
      buttons: buttons
    });
    await alert.present();
    return await alert.onDidDismiss();
  }
  return null;
}