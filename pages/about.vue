<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>About</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-button router-link="/" router-direction="back">Home</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import routes from "@/mixins/routes";
export default {
  name: 'AboutPage',
  mixins: [
    routes
  ]
}
</script>

<style scoped></style>
