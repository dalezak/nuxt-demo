<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <grid-cards :loading="loading" :limit="limit" :count="count" :search="search" label="items" @more="loadItems(offset+limit)">
        <template :key="item.id" v-for="item of items">
          <transition appear name="fade" mode="out-in">
            <ion-card>
              <ion-card-header>
                <ion-card-title>{{ item.name }}</ion-card-title>
                <ion-card-subtitle>{{ item.description }}</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </transition>
        </template>
      </grid-cards> 
    </ion-content>
  </ion-page>
</template>

<script>
import routes from "@/mixins/routes";
export default defineComponent({
  name: 'HomePage',
  mixins: [
    routes
  ],
  data() {
    return {
      limit: 12,
      offset: 0,
      count: 0,
      search: "",
      items: [],
      loading: false
    }
  },
  async mounted() {
    this.loadItems();
  },
  methods: {
    async loadItems(offset=0) {
      try {
        this.loading = true;
        this.offset = offset;
        const { data:items } = await useFetch('/api/items', {
          key: `items-${this.offset}-${this.limit}-${this.search}`,
          params: {
            limit: this.limit, 
            offset: this.offset,
            search: this.search
          },
          initialCache: false
        })
        console.log(`loadItems ${this.offset} to ${this.offset + this.limit}`, items.value);
        if (this.offset == 0) {
          this.items = items.value;
        }
        else {
          this.items.push(...items.value);
        }
        this.count = this.items ? this.items.length : 0;
      }
      catch (error) {
        console.error("loadItems", error);
      }
      finally {
        this.loading = false;
      }
    },
    async serverFetch() {
      const { data } = await useFetch('/api/fetch', {
        method: 'get',
        params: {
          test: 123
        }
      })
      console.log("serverFetch", data.value);
    },
    async serverSubmit() {
      const { data } = await useFetch('/api/submit', {
        method: 'post',
        body: { 
          test: 123 
        }
      })
      console.log("serverSubmit", data.value);
    }
  }
})
</script>