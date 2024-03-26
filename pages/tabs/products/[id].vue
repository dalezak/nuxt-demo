<template>
  <ion-page>
    <ion-header :translucent="true" v-if="isApp">
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
      <top-bar :breadcrumbs="state.breadcrumbs"></top-bar>
      <fab-button icon="share" @click="shareProduct" v-if="isWeb"></fab-button>
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
  middleware: 'auth'
})
const { isApp, isWeb } = useAppScreen();

const { params } = useAppRoute();

const state = reactive({
  breadcrumbs: [
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
  ]
});

const productsStore = useProductsStore();
const { loadProduct } = productsStore;
const { product } = storeToRefs(productsStore);

async function shareProduct() {
  shareSocial(product.title, product.body);
}

async function loadData() {
  await loadProduct({ 
    id: params.id
  });
}

if (isApp.value) {
  onMounted(async () => {
    await loadData();
  });
}
else {
  await loadData();
}
</script>

<style scoped lang="scss">

</style>
