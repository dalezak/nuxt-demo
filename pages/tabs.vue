<template>
  <ion-page>
    <ion-header v-if="hasUser == false">
      <ion-toolbar>
        <ion-title>Nuxt</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="showPageLogin" title="Login">Login</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-tabs v-if="hasUser">
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="home" href="/home">
            <ion-icon :icon="ioniconsHome" />
            <ion-label>Home</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="posts" href="/posts">
            <ion-icon :icon="ioniconsChatboxOutline" />
            <ion-label>Posts</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="profile" href="/profile">
            <ion-icon :icon="ioniconsPerson" />
            <ion-label>Profile</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
      <template v-else>
        <h1>Welcome</h1>
      </template>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  alias: ['/'],
})

const route = useRoute();

const userStore = useUserStore();
const { hasUser } = storeToRefs(userStore);

onMounted(() => {
  if (hasUser && route.path == "/") {
    showPageHome();
  }
})
</script>