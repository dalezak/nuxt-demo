<template>
  <ion-page>
    <ion-header :translucent="true" v-if="isMobile">
      <ion-toolbar>
        <ion-title>Products</ion-title>
        <ion-buttons slot="primary">
          <ion-button color="primary" @click="showPageProductNew">
            <ion-icon slot="icon-only" :icon="ioniconsAdd"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-refresher slot="fixed" @ionRefresh="searchProducts(0, $event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <top-bar :search="search" :breadcrumbs="breadcrumbs" @search="searchProducts(0)"></top-bar>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end" v-if="isWeb">
        <ion-fab-button @click="showPageProductNew">
          <ion-icon :icon="ioniconsAdd"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <grid-cards :loading="loading" :limit="limit" :count="count" :search="search" label="products" @more="searchProducts(offset+limit)">
        <product-card :user="getUser" :product="product" @share="shareProduct(product)" @click="showPageProduct(product.id)" :key="product.id" v-for="product of getProducts"></product-card>
      </grid-cards>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { isMobile, isWeb } = usePlatform();

const route = useRoute();

const limit = 12;
let offset = $ref(0);
let count = $ref(0);
let search = $ref(route.query.search);
let loading = $ref(false);

const breadcrumbs = [
  {
    name: "products",
    label: "Products",
    path: "/products"
  }
];

const userStore = useUserStore();
const productStore = useProductStore();

const { getUser } = storeToRefs(userStore);
const { getProducts } = storeToRefs(productStore);
const { loadProducts } = productStore;

function searchChanged(_search) {
  search = _search;
  searchProducts();
}

async function searchProducts(_offset = 0, event = null) {
  consoleLog("searchProducts");
  try {
    loading = true;
    offset = _offset;
    let products = await loadProducts({
      limit: limit, 
      offset: offset, 
      search: search
    });
    count = products ? products.length : 0;
  }
  catch (error) {
    showWarning("Problem Loading Products", error.message);
  }
  finally {
    loading = false;
    if (event && event.target) {
      event.target.complete();
    }
  }
}

searchChanged();
</script>

<style scoped lang="scss">
</style>
