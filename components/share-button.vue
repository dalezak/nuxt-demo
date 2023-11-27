<template>
  <ion-button :id="uid" fill="clear" title="Share" :class="css" @click="onShare">
    <ion-icon :icon="ioniconsShareSocialOutline"></ion-icon>
  </ion-button>
  <ion-popover :trigger="uid" side="bottom" alignment="center" dismiss-on-select="true">
    <ion-content>
      <ion-list>
        <ion-list-header>
          <ion-label>Share via</ion-label>
        </ion-list-header>
        <ion-item button="true" detail="false" @click="shareTwitter(title, description, url)">Twitter</ion-item>
        <ion-item button="true" detail="false" @click="shareFacebook(title, description, url)">Facebook</ion-item>
        <ion-item button="true" detail="false" @click="shareLinkedIn(title, description, url)">LinkedIn</ion-item>
        <ion-item button="true" detail="false" @click="shareEmail(title, description, url)">Email</ion-item>
      </ion-list>
    </ion-content>
  </ion-popover>
</template>

<script setup>
const uid = getCurrentInstance().uid;

const props = defineProps({
  css: {
    type: String,
    default: "ion-float-right"
  },
  title: {
    type: String
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
  }
})

function onShare(event) {
  event.stopPropagation();
}
</script>

<style lang="scss" scoped>

</style>