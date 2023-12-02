<template>
  <ion-page>
    <ion-header v-if="isMobile">
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <grid-cards :loading="loading" :limit="limit" :count="count" :search="search" label="items" @more="loadItems(offset+limit)">
        <item-card :item="item" :key="item.id" v-for="item of items"></item-card>
      </grid-cards> 
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
})

const { isMobile } = usePlatform();

const limit = 12;
let offset = $ref(0);
let count = $ref(0);
let search = $ref("");
let items = reactive([]);
let loading = $ref(false);

async function loadItems(_offset=0) {
  showLoading();
  try {
    loading = true;
    offset = _offset;
    const { data: results } = await useFetch('/api/items', {
      key: `items-${offset}-${limit}-${search}`,
      params: {
        limit: limit, 
        offset: offset,
        search: search
      },
      initialCache: false
    });
    console.log(`loadItems ${offset} to ${offset + limit}`, results.value);
    if (offset == 0) {
      items.splice(0);
    }
    items.push(...results.value);
    count = items.length;
  }
  catch (error) {
    console.error("loadItems", error);
    showWarning("Problem Loading Items", error);
  }
  finally {
    loading = false;
    hideLoading();
  }
}

loadItems();
</script>
