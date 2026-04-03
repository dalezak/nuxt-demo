<template>
  <transition appear name="fade" mode="out-in">
    <ion-card class="ion-margin" button="true">
      <ion-card-header>
        <ion-card-title v-if="post.title">{{ post.title }}</ion-card-title>
        <ion-card-subtitle v-if="post.body">{{ textTruncate( post.body, 100) }}</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-button fill="clear" title="Share" class="ion-float-right" @click="onShare">
          <ion-icon :icon="ioniconsShareSocialOutline"></ion-icon>
        </ion-button>
      </ion-card-content>
    </ion-card>
  </transition>
</template>

<script setup>
const props = defineProps({
  post: {
    type: Object
  }
});

const emits = defineEmits([
  "share"
]);

function onShare(event) {
  event.stopPropagation();
  emits("share", props.post, event);
}
</script>

<style scoped lang="scss">

</style>