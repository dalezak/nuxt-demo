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
    showIndexPage() {
      this.showRootPage("/");
    },
    showHomePage() {
      this.showRootPage("/home");
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