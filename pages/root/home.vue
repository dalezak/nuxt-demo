<template>
  <ion-page>
    <ion-header v-if="isMobile">
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="loadItems(0, $event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
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

const { isMobile, isWeb } = usePlatform();

const limit = 12;
let offset = $ref(0);
let count = $ref(0);
let search = $ref("");
let items = reactive([]);
let loading = $ref(false);

async function loadItems(_offset=0, event = null) {
  try {
    loading = true;
    offset = _offset;
    const { data: results } = await useFetch('/api/items', {
      key: `items-${limit}-${offset}-${search}`,
      params: {
        limit: limit, 
        offset: offset,
        search: search
      },
      initialCache: false
    });
    console.log(`loadItems ${offset} to ${offset + limit}`, results.value.length);
    if (offset == 0) {
      items.splice(0);
    }
    items.push(...results.value);
    count = results.value.length;
  }
  catch (error) {
    console.error("loadItems", error);
    showWarning("Problem Loading Items", error);
  }
  finally {
    loading = false;
    if (event && event.target) {
      event.target.complete();
    }
  }
}

loadItems();
</script>
