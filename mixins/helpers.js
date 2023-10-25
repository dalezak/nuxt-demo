import {
  loadingController,
  toastController,
  alertController,
  modalController,
  popoverController,
  actionSheetController
} from "@ionic/vue";

export default {
  methods: {
    hasMore(items, limit) {
      return items && items.length > 0 && (items.length >= limit && items.length % limit > 0);
    },
    isVisible(selector) {
      let element = document.querySelector(selector);
      return element && element.offsetParent != null;
    },
    hasFunction(object, method) {
      return object != null && typeof object[method] == "function";
    },
    getElementById(id) {
      return id && id.length > 0 ? document.getElementById(id) : null;
    },
    getCookie(key) {
      return this.$cookie.getCookie(key);
    },
    hasCookie(key) {
      return this.$cookie.isCookieAvailable(key);
    },
    setCookie(key, value) {
      return this.$cookie.setCookie(key, value, {
        expire: -1,
        path: "/",
        domain: "",
        secure: "",
        sameSite: ""
      });
    },
    showRootPage(params) {
      this.$router.replace(params, () => { });
    },
    showPage(params) {
      this.$router.push(params, () => { });
    },
    hidePage() {
      this.$router.go(-1);
    },
    goBack() {
      this.$router.go(-1);
    },
    openUrl(url) {
      if (url.startsWith("mailto:")) {
        window.open(url, "_blank");
      }
      else if (url.startsWith("tel:")) {
        window.open(url, "_blank");
      }
      else if (url.startsWith("http")) {
        window.open(url, "_blank");
      }
      else {
        window.open("http://" + url, "_blank");
      }
    },
    openEmail(email) {
      window.open(`mailto:${email}`, "_blank");
    },
    openPhone(telephone) {
      window.open(`tel:${telephone}`, "_blank");
    },
    async showToast(message, params = {}, duration = 2000) {
      const toast = await toastController.create({
        message: message,
        duration: duration
      });
      toast.present();
      return toast;
    },
    async showLoading(message = "Loading...", hide = 0) {
      if (this.$loading) {
        this.$loading.message = message;
      }
      else {
        this.$loading = await loadingController.create({
          message: message
        });
        await this.$loading.present();
      }
      if (hide > 0) {
        this.hideLoading(hide);
      }
      return this.$loading;
    },
    async hideLoading(delay = 200) {
      setTimeout(async() => {
        if (this.$loading) {
          await this.$loading.dismiss();
          this.$loading = null;
        }
      }, delay);
    },
    async showActionSheet(options = {}, cancel = true) {
      let buttons = [];
      for (let option of Object.keys(options)) {
        buttons.push({
          text: options[option],
          data: {
            action: option,
          },
        });
      }
      if (cancel) {
        buttons.push({
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        });
      }
      const actionSheet = await actionSheetController.create({ buttons: buttons });
      await actionSheet.present();
      const data = await actionSheet.onDidDismiss();
      return data && data.data && data.data.action ? data.data.action : null;
    },
    async showAlert(title, subtitle = null, message = null, buttons = [
      "Ok"
    ]) {
      let alert = await alertController.create({
        header: title ? title : null,
        subHeader: subtitle ? subtitle : null,
        message: message ? message : null,
        buttons: buttons
      });
      await alert.present();
      return await alert.onDidDismiss();
    },
    async hideAlert() {
      await alertController.dismiss();
    },
    async showConfirm(title, subtitle = null, message = null, callback) {
      this.showAlert(title, subtitle, message, [
        {
          text: "Cancel"
        }, {
          text: "Ok",
          handler: () => {
            if (callback) {
              callback();
            }
          }
        }
      ]);
    },
    async showModal(component, props = {}, cssClasses = []) {
      let modal = await modalController.create({
        component: component,
        componentProps: props,
        cssClass: cssClasses.join(" ")
      });
      await modal.present();
      return await modal.onDidDismiss();
    },
    async hideModal(data = null) {
      await modalController.dismiss(data);
    },
    async showPopover(component, props = {}, event = null) {
      const popover = await popoverController.create({
        component: component,
        componentProps: props,
        event: event,
        translucent: true
      });
      await popover.present();
      return await popover.onDidDismiss();
    },
    async showError(title, error) {
      return await this.showAlert(title, error);
    },
    setFocus(element) {
      if (element && element.$el) {
        if (this.hasFunction(element.$el, "setFocus")) {
          element.$el.setFocus();
        }
        else {
          element.$el.scrollIntoView(false);
        }
      }
      else if (element) {
        if (this.hasFunction(element, "setFocus")) {
          element.setFocus();
        }
        else {
          element.scrollIntoView(false);
        }
      }
    },
    setFocusById(id) {
      let element = document.getElementById(id);
      if (element) {
        if (this.hasFunction(element, "setFocus")) {
          element.setFocus();
        }
        else {
          element.scrollIntoView(false);
        }
      }
    },
    showHomePage() {
      this.showRootPage({
        path: "/"
      });
    },
    showAboutPage() {
      this.showRootPage({
        path: "/about"
      });
    },
    showUserLogin() {
      this.showRootPage({
        path: "/login"
      });
    },
    showUserLogout() {
      this.showRootPage({
        path: "/logout"
      });
    }
  }
};