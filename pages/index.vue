<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Nuxt</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-button router-link="/about" router-direction="forward">View About</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
</script>