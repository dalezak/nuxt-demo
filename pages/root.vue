<template>
  <ion-page>
    <ion-header>
      <nav-bar :title="name" :links="links" :visible="isWeb" :user="currentUser"></nav-bar>
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
const { name, links } = useAppConfig();
const { path } = useRoute();
const currentUser = useCurrentUser();

onMounted(() => {
  if (currentUser && path == "/") {
    showPageHome();
  }
})
</script>