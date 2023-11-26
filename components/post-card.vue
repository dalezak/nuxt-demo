<template>
  <transition appear name="fade" mode="out-in">
    <ion-card class="ion-margin" :button="loading==false">
      <ion-card-header>
        <ion-card-title v-if="post.title">{{ post.title }}</ion-card-title>
        <ion-card-subtitle v-if="post.body">{{ truncateText( post.body, 100) }}</ion-card-subtitle>
      </ion-card-header>
      <ion-button fill="clear" title="Share" class="ion-float-right" @click="sharePost">
        <ion-icon :icon="ioniconsShareSocialOutline"></ion-icon>
      </ion-button>
    </ion-card>
  </transition>
</template>

<script setup>
const props = defineProps({
  post: {
    type: Object
  }
});

const emit = defineEmits([
  "share"
])

function sharePost(event) {
  event.stopPropagation();
  emit('share', props.post);
}
</script>

<style scoped lang="scss">

</style>