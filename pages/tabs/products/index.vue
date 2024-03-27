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
      <top-bar :search="state.search" :breadcrumbs="state.breadcrumbs" @search="searchChanged"></top-bar>
      <fab-button icon="add" @click="showProductNew" v-if="isWeb"></fab-button>
      <grid-cards label="products"
        :loading="state.loading" :limit="state.limit" 
        :count="state.count" :search="state.search" 
        @more="searchProducts(state.offset+state.limit)">
        <product-card :key="product.id" v-for="product of getProducts"
          :user="profile" :product="product" 
          @share="shareProduct(product)" @click="showProductDetails(product.id)"></product-card>
      </grid-cards>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { isApp, isWeb } = useAppScreen();

const state = reactive({
  limit: 12,
  offset: 0,
  count: 0,
  search: "",
  loading: false,
  breadcrumbs: [
    {
      name: "products",
      label: "Products",
      path: "/products"
    }
  ]
});

const usersStore = useUsersStore();
const { loadProfile } = usersStore;
const { profile } = storeToRefs(usersStore);

const productsStore = useProductsStore();
const { loadProducts } = productsStore;
const { getProducts } = storeToRefs(productsStore);

function searchChanged(search = "") {
  state.search = search;
  searchProducts();
}

async function searchProducts(offset = 0, event = null) {
  try {
    state.loading = true;
    state.offset = offset;
    let products = await loadProducts({
      limit: state.limit, 
      offset: state.offset, 
      search: state.search
    });
    state.count = products ? products.length : 0;
  }
  catch (error) {
    consoleLog("searchProducts", error)
    showError("Problem Loading Products", error.message);
  }
  finally {
    state.loading = false;
    if (event && event.target) {
      event.target.complete();
    }
  }
}

async function loadData() {
  await loadProfile();
  await searchProducts();
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
