<template>
  <ion-button fill="clear" title="Share" :class="css" @click="onShare">
    <ion-icon :icon="ioniconsShareSocialOutline"></ion-icon>
  </ion-button>
</template>

<script setup>
const props = defineProps({
  css: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  url: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },
  facebook: {
    type: Boolean,
    default: true
  },
  twitter: {
    type: Boolean,
    default: true
  },
  linkedin: {
    type: Boolean,
    default: true
  },
  pinterest: {
    type: Boolean,
    default: true
  },
  email: {
    type: Boolean,
    default: true
  }
})

function onShare(event) {
  event.stopPropagation();
  showPopoverShare(event, props);
}
</script>

<style lang="scss" scoped>

</style>