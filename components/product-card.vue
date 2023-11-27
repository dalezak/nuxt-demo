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
        <share-button :title="product.title" :description="product.description" :image="product.image" css="ion-float-right"></share-button>
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
</script>

<style scoped lang="scss">

</style>