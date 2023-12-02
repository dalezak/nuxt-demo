<template>
  <ion-page>
    <ion-header>
      <nav-bar :links="links" :visible="isWeb" :user="currentUser"></nav-bar>
    </ion-header>
    <ion-content>
      <tab-bar :tabs="links" :visible="isMobile" v-if="currentUser"></tab-bar>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  alias: ['/'],
  middleware: 'auth'
})

const { isMobile, isWeb } = usePlatform();

const links = [
  {
    name: "home",
    label: "Home",
    path: "/home",
    icon: "home"
  },
  {
    name: "products",
    label: "Products",
    path: "/products",
    icon: "shirtOutline"
  },
  {
    name: "posts",
    label: "Posts",
    path: "/posts",
    icon: "chatboxOutline"
  },
  {
    name: "profile",
    label: "Profile",
    path: "/profile",
    icon: "person"
  }
]
const { path } = useRoute();
const currentUser = useCurrentUser();

onMounted(() => {
  if (currentUser && path == "/") {
    showPageHome();
  }
})
</script>