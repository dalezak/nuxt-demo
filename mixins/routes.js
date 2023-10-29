export default {
  methods: {
    showRootPage(path) {
      this.$router.replace({ path: path }, () => { });
    },
    showPage(path) {
      this.$router.push({ path: path }, () => { });
    },
    hidePage() {
      this.$router.go(-1);
    },
    goBack() {
      this.$router.go(-1);
    },
    showHomePage() {
      this.showRootPage("/");
    },
    showProfilePage() {
      this.showRootPage("/profile");
    },
    showAboutPage() {
      this.showRootPage("/about");
    },
    showUserLogin() {
      this.showRootPage("/login");
    },
    showUserLogout() {
      this.showRootPage("/logout");
    }
  }
};