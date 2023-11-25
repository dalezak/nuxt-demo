<template>
  <ion-page>
    <ion-header v-if="isAuthenticated == false">
      <ion-toolbar>
        <ion-title>Nuxt</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="showPageLogin" title="Login">Login</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-tabs v-if="isAuthenticated">
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="home" href="/home">
            <ion-icon :icon="ioniconsHome" />
            <ion-label>Home</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="products" href="/products">
            <ion-icon :icon="ioniconsShirtOutline" />
            <ion-label>Products</ion-label>
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
  middleware: 'auth'
})

const route = useRoute();
const isAuthenticated = useAuthenticated();

onMounted(() => {
  if (isAuthenticated && route.path == "/") {
    showPageHome();
  }
})
</script>