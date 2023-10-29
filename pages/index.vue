<template>
  <ion-page>
    <ion-header v-if="user == null">
      <ion-toolbar>
        <ion-title>Nuxt</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="showUserLogin" title="Login">Login</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-tabs v-if="user">
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="profile" href="/profile">
            <ion-icon :icon="ioniconsPerson" />
            <ion-label>Profile</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
      <template v-else>
        <h1>Welcome</h1>
      </template>
    </ion-content>
  </ion-page>
</template>

<script>
import routes from "@/mixins/routes";
import { mapState } from 'pinia';
import { useUsersStore } from '@/stores/users';
export default defineComponent({
  name: 'HomePage',
  mixins: [
    routes
  ],
  computed: {
    ...mapState(useUsersStore, ['user', 'getUser', 'hasUser']),
  },
  async mounted() {
    if (this.hasUser) {
      this.showProfilePage();
    }
  },
  methods: {

  }
})
</script>