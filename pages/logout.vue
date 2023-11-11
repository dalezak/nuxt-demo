<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Nuxt</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
        
    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { mapActions } from 'pinia';

import { useUserStore } from '@/stores/users';

import routes from "@/mixins/routes";

export default {
  name: "UserLogout",
  mixins: [
    routes
  ],
  async mounted() {
    await this.userLogout();
    await this.showUserLogin();
  },
  methods: {
  ...mapActions(useUserStore, ['userLogout']),
  }
}
</script>

<style scoped lang="scss">

</style>