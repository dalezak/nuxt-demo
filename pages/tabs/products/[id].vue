<template>
  <ion-page>
    <ion-header :translucent="true" v-if="isMobile">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/products"></ion-back-button>
        </ion-buttons>
        <ion-title>Products</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="shareProduct" v-if="product">
            <ion-icon slot="icon-only" :icon="ioniconsShareOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <top-bar :breadcrumbs="breadcrumbs"></top-bar>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end" v-if="isWeb">
        <ion-fab-button @click="shareProduct">
          <ion-icon :icon="ioniconsShareOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
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
const { isMobile, isWeb } = usePlatform();

const { params } = useRoute();

const breadcrumbs = [
  {
    name: "products",
    label: "Products",
    path: "/products"
  },
  {
    name: "product",
    label: "Product",
    path: `/products/${params.id}`
  }
];

const productStore = useProductStore();
const { product } = storeToRefs(productStore);
const { loadProduct } = productStore;

async function shareProduct(event) {
  showPopoverShare(event, {
    title: product.title,
    description: product.body,
    image: product.image
  })
}

try {
  await loadProduct({ 
    id: params.id
  });
}
catch (error) {
  showWarning("Problem Loading Product", error.message);
}
</script>

<style scoped lang="scss">

</style>
