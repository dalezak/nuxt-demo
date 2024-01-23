<template>
  <ion-page>
    <ion-header v-if="isMobile">
      <ion-toolbar>
        <ion-title>Profile</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="showPageLogout" title="Logout">
            <ion-icon slot="icon-only" :icon="ioniconsLogOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-button router-link="/about" router-direction="forward">About Link</ion-button>
      <ion-button @click="showPageAbout()">Show About</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
const { isMobile, isWeb } = usePlatform();
</script>