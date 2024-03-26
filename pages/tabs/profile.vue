<template>
  <ion-page>
    <ion-header v-if="isApp">
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
          <ion-list v-if="profile">
            <ion-item>
              <ion-input v-model="profile.name" label="Name" readonly></ion-input>
            </ion-item>
            <ion-item>
              <ion-input v-model="profile.email" label="Email" readonly></ion-input>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
      <ion-button class="ion-margin" expand="block" fill="outline" @click="showUserLogout">Logout</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { isApp } = useAppScreen();
const { profile, loadProfile } = useUsersStore();

const loadData = async () => {
  await loadProfile();
}

if (isApp.value) {
  onMounted(async () => {
    await loadData();
  });
}
else {
  await loadData();
}
</script>