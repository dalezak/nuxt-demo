<template>
  <ion-page>
    <ion-header v-if="!currentUser">
      <ion-toolbar>
        <ion-title>Nuxt</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="showPageLogin" title="Login">Login</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-tabs v-if="currentUser">
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
        <ion-grid>
          <ion-row class="ion-justify-content-center">
            <ion-col size="12" size-sm="12" size-md="10" size-lg="8" size-xl="6">
              <ion-card class="ion-margin">
                <ion-card-header>
                  <ion-card-title>{{ title }}</ion-card-title>
                  <ion-card-subtitle>{{ subtitle }}</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>{{ description }}</ion-card-content>
              </ion-card>
              <ion-card class="ion-margin">
                <ion-card-content>
                  <ion-button fill="clear" @click="showPageLogin">Login to get started</ion-button>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </template>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  alias: ['/'],
  middleware: 'auth'
})

const title = "Welcome";
const subtitle = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const route = useRoute();
const currentUser = useCurrentUser();

onMounted(() => {
  if (currentUser && route.path == "/") {
    showPageHome();
  }
})
</script>