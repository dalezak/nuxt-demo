<template>
  <ion-page>
    <ion-header v-if="isMobile">
      <ion-toolbar>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Profile</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list v-if="user">
            <ion-item>
              <ion-input v-model="user.name" label="Name" readonly></ion-input>
            </ion-item>
            <ion-item>
              <ion-input v-model="user.email" label="Email" readonly></ion-input>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
      <ion-button class="ion-margin" expand="block" fill="outline" @click="showPageLogout">Logout</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { isMobile } = usePlatform();
const { loadProfile } = useUserStore();
const user = await loadProfile();

</script>