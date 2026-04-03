<template>
  <ion-page>
    <ion-header :translucent="true" v-if="isApp">
      <ion-toolbar>
        <ion-title>Products</ion-title>
        <ion-buttons slot="primary">
          <ion-button color="primary" @click="showProductNew">
            <ion-icon slot="icon-only" :icon="ioniconsAdd"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-refresher slot="fixed" @ionRefresh="searchProducts(0, $event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <breadcrumb-bar :search="state.search" :breadcrumbs="state.breadcrumbs" @search="searchChanged"></breadcrumb-bar>
      <fab-button icon="add" @click="showProductNew" v-if="isWeb"></fab-button>
      <grid-cards label="products" sm="1" md="2" lg="3" xl="4"
        :loading="state.loading" :limit="state.limit" 
        :count="state.count" :search="state.search" 
        @more="searchProducts(state.offset+state.limit)">
        <product-card :key="product.id" v-for="product of getProducts"
          :user="profile" :product="product" 
          @share="shareProduct(product, $event)" 
          @click="showProductDetails(product.id)"></product-card>
      </grid-cards>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { isApp, isWeb } = useAppScreen();

const usersStore = useUsersStore();
const { loadProfile } = usersStore;
const { profile } = storeToRefs(usersStore);

const productsStore = useProductsStore();
const { loadProducts } = productsStore;
const { getProducts } = storeToRefs(productsStore);

const { state, searchChanged, run: searchProducts } = useSearchPagination(loadProducts, "Problem Loading Products");
state.breadcrumbs = [{ name: "products", label: "Products", path: "/products" }];

async function loadData() {
  await loadProfile();
  await searchProducts();
}

onMounted(async () => {
  await loadData();
});
</script>

<style scoped lang="scss">
</style>
