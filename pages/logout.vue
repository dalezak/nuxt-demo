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

<script setup>
const userStore = useUserStore();
const { userLogout } = userStore;

onMounted (async () => {
  await userLogout();
  await showPageLogin();
})
</script>

<style scoped lang="scss">

</style>