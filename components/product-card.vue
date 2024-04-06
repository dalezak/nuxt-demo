<template>
  <transition appear name="fade" mode="out-in">
    <ion-card class="ion-margin" button="true">
      <ion-card-header>
        <ion-card-title v-if="product.title">{{product.title}}</ion-card-title>
        <ion-card-subtitle v-if="product.description">{{ textTruncate(product.description, 100) }}</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ion-chip v-if="product.price">{{ textMoney(product.price) }}</ion-chip>
        <ion-chip v-if="product.rating">{{ textRating(product.rating.rate, 5) }}</ion-chip>
        <ion-button fill="clear" title="Share" class="ion-float-right" @click="onShare">
          <ion-icon :icon="ioniconsShareSocialOutline"></ion-icon>
        </ion-button>
      </ion-card-content>
    </ion-card>
  </transition>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object
  }
});

const emits = defineEmits([
  "share"
]);

function onShare(event) {
  event.stopPropagation();
  emits("share", props.product, event);
}
</script>

<style scoped lang="scss">

</style>