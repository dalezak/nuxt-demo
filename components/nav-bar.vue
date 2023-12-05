<template>
  <ion-toolbar v-show="visible">
    <ion-title>{{ title }}</ion-title>
    <ion-buttons slot="end" v-if="user">
      <ion-button @click="showPage(link.path, false)" :title="link.label" :key="link.name" v-for="link of links">{{ link.label }}</ion-button>
    </ion-buttons>
    <ion-buttons slot="end" v-else>
      <ion-button @click="showPageAbout" title="About">About</ion-button>
      <ion-button @click="showPageLogin" title="Login">Login</ion-button>
    </ion-buttons>
  </ion-toolbar>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "App"
  },
  links: {
    type: Array,
    default: () => []
  },
  visible: {
    type: Boolean,
    default: true
  },
  user: {
    type: Object
  }
});
</script>

<style scoped lang="scss">

</style>