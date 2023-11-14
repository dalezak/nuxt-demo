<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Error</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title v-if="error">{{ error.statusCode }}</ion-card-title>
          <ion-card-title v-else>Unknown Error</ion-card-title>
          <ion-card-subtitle v-if="error">{{ error.statusMessage }}</ion-card-subtitle>
          <ion-card-subtitle v-else>Something went wrong.</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content v-if="error">{{ error.description }}</ion-card-content>
        <ion-button fill="clear" @click="goHome">Go Home</ion-button>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
const props = defineProps({
  error: Object
})
const goHome = () => clearError({ redirect: '/' })
</script>