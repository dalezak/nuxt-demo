<template>
  <transition appear name="fade" mode="out-in">
    <ion-card class="ion-margin" button="true">
      <ion-card-header>
        <ion-card-title v-if="post.title">{{ post.title }}</ion-card-title>
        <ion-card-subtitle v-if="post.body">{{ textTruncate( post.body, 100) }}</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <share-button :title="post.title" :description="post.description" css="ion-float-right"></share-button>
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