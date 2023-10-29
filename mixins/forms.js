export default {
  methods: {
    hasFunction(object, method) {
      return object != null && typeof object[method] == "function";
    },
    hasMore(items, limit) {
      return items && items.length > 0 && (items.length >= limit && items.length % limit > 0);
    },
    isVisible(selector) {
      let element = document.querySelector(selector);
      return element && element.offsetParent != null;
    },
    getElementById(id) {
      return id && id.length > 0 ? document.getElementById(id) : null;
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
  }
};