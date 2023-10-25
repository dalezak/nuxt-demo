<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Nuxt</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="showUserLogout" title="Logout">
            <ion-icon slot="icon-only" :icon="ioniconsLogOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-button router-link="/about" router-direction="forward">View About</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import helpers from "@/mixins/helpers";
export default defineComponent({
  name: 'HomePage',
  mixins: [
    helpers
  ],
  setup() {
    definePageMeta({
      middleware: [
        'auth'
      ]
    })
  },
})
</script>

