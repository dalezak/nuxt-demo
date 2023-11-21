import { popoverController } from "@ionic/vue";
export default async function (component, props = {}, event = null) {
  if (process.client) {
    const popover = await popoverController.create({
      component: component,
      componentProps: props,
      event: event,
      translucent: true
    });
    await popover.present();
    return await popover.onDidDismiss();
  }
  return null;
}