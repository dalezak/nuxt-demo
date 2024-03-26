<template>
  <ion-page>
    <ion-header v-if="isApp">
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-refresher slot="fixed" @ionRefresh="loadItems(0, $event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <grid-cards label="items" 
        :loading="state.loading" :limit="state.limit" 
        :count="state.count" :search="state.search" 
        @more="loadItems(state.offset+state.limit)">
        <item-card :item="item" :key="item.id" v-for="item of state.items"></item-card>
      </grid-cards> 
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { isApp } = useAppScreen();

const state = reactive({
  limit: 12,
  offset: 0,
  count: 0,
  search: "",
  items: [],
  loading: false
});

async function loadItems(offset = 0, event = null) {
  try {
    state.loading = true;
    state.offset = offset;
    const { data: items } = await useFetch('/api/items', {
      key: `items-${state.limit}-${state.offset}-${state.search}`,
      params: {
        limit: state.limit, 
        offset: state.offset,
        search: state.search
      },
      initialCache: false
    });
    consoleLog(`loadItems ${state.offset} to ${state.offset + state.limit}`, items.value.length);
    if (state.offset == 0) {
      state.items.splice(0);
    }
    state.items.push(...items.value);
    state.count = items.value.length;
  }
  catch (error) {
    consoleError("loadItems", error);
    showError("Problem Loading Items", error);
  }
  finally {
    state.loading = false;
    if (event && event.target) {
      event.target.complete();
    }
  }
}

const loadData = async () => {
  await loadItems();
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
