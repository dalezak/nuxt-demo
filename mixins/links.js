export default {
  methods: {
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
    }
  }
};