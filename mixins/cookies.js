export default {
  methods: {
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
    }
  }
};