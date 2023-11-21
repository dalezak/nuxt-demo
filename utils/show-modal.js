import { modalController } from "@ionic/vue";
export default async function (component, props = {}, cssClasses = []) {
  if (process.client) {
    let modal = await modalController.create({
      component: component,
      componentProps: props,
      cssClass: cssClasses.join(" ")
    });
    await modal.present();
    return await modal.onDidDismiss();
  }
  return null;
}