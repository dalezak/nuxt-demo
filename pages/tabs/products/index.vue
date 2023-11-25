<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Products</ion-title>
        <ion-buttons slot="primary">
          <ion-button color="primary" @click="showProductForm">
            <ion-icon slot="icon-only" :icon="ioniconsAdd"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <grid-cards :loading="loading" :limit="limit" :count="count" :search="search" label="products" @more="searchProducts(offset+limit)">
        <product-card :user="getUser" :product="product" @share="shareProduct(product)" @click="showProductDetails(product.id)" :key="product.id" v-for="product of getProducts"></product-card>
      </grid-cards>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const limit = 12;
let offset = $ref(0);
let count = $ref(0);
let search = $ref("");
let loading = $ref(false);

const userStore = useUserStore();
const productStore = useProductStore();

const { getUser } = storeToRefs(userStore);
const { getProducts } = storeToRefs(productStore);
const { loadProducts } = productStore;

function searchChanged(_search) {
  search = _search;
  searchProducts();
}

async function searchProducts(_offset = 0) {
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
  }
}

async function showProductForm() {
  console.log("showProductForm");
}

function showProductDetails(id) {
  console.log("showProductDetails", id);
}

async function shareProduct(product) {
  console.log("shareProduct", product);
}

searchChanged();
</script>

<style scoped lang="scss">

</style>
