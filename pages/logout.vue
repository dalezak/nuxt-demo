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
import {
  defineComponent
} from "vue";

import { mapActions } from 'pinia';

import { useUsersStore } from '@/stores/users';

import helpers from "@/mixins/helpers";

export default defineComponent({
  name: "UserLogout",
  mixins: [
    helpers
  ],
  async mounted() {
    await this.userLogout();
    await this.showUserLogin();
  },
  methods: {
  ...mapActions(useUsersStore, ['userLogout']),
  }
});
</script>

<style scoped lang="scss">

</style>