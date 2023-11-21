<template>
  <transition appear name="fade" mode="out-in">
    <ion-card class="ion-margin" :button="loading==false">
      <ion-card-header>
        <ion-card-title>
          <ion-skeleton-text :animated="true" v-if="loading"></ion-skeleton-text>
          <span v-else-if="post">{{post.title}}</span>
        </ion-card-title>
      </ion-card-header>
      <ion-button fill="clear" :disabled="true" class="ion-float-right" v-if="loading">
        <ion-skeleton-text :animated="true" style="width: 40px"></ion-skeleton-text>
      </ion-button>
      <ion-button fill="clear" title="Share" class="ion-float-right" @click="sharePost" v-else-if="post">
        <ion-icon :icon="ioniconsShareSocialOutline"></ion-icon>
      </ion-button>
    </ion-card>
  </transition>
</template>

<script setup>
const props = defineProps({
  post: {
    type: Object
  },
  loading: {
    type: Boolean,
    default: false
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