export default async function (element) {
  if (process.client) {
    if (element && element.$el) {
      if (hasFunction(element.$el, "setFocus")) {
        element.$el.setFocus();
      }
      else {
        element.$el.scrollIntoView(false);
      }
    }
    else if (element) {
      if (hasFunction(element, "setFocus")) {
        element.setFocus();
      }
      else {
        element.scrollIntoView(false);
      }
    }
  }
}