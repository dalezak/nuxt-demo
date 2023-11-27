<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/products"></ion-back-button>
        </ion-buttons>
        <ion-title>Products</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="shareProduct(product)" v-if="product">
            <ion-icon slot="icon-only" :icon="ioniconsShareOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-card class="ion-margin" v-if="product">
        <ion-card-header>
          <ion-card-title>{{product.title}}</ion-card-title>
        </ion-card-header>
        <ion-card-content>{{product.description}}</ion-card-content>
        <ion-card-content>
          <ion-chip v-if="product.price">{{ textMoney(product.price) }}</ion-chip>
          <ion-chip v-if="product.rating">{{ textRating(product.rating.rate, 5) }}</ion-chip>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  title: 'Product'
})

const route = useRoute();

const productStore = useProductStore();
const { product } = storeToRefs(productStore);
const { loadProduct } = productStore;

async function shareProduct(product) {
  console.log("shareProduct", product);
}

try {
  await loadProduct({ 
    id: route.params.id
  });
}
catch (error) {
  showWarning("Problem Loading Product", error.message);
}
</script>

<style scoped lang="scss">

</style>
