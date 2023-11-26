<template>
  <transition appear name="fade" mode="out-in">
    <ion-card class="ion-margin" button="true">
      <ion-card-header>
        <ion-card-title v-if="product.title">{{product.title}}</ion-card-title>
        <ion-card-subtitle v-if="product.description">{{ truncateText(product.description, 100) }}</ion-card-subtitle>
      </ion-card-header>
      <ion-button fill="clear" title="Share" class="ion-float-right" @click="shareProduct">
        <ion-icon :icon="ioniconsShareSocialOutline"></ion-icon>
      </ion-button>
    </ion-card>
  </transition>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object
  }
});

const emit = defineEmits([
  "share"
])

function shareProduct(event) {
  event.stopPropagation();
  emit('share', props.product);
}
</script>

<style scoped lang="scss">

</style>