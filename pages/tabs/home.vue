<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
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
  async mounted() {
    // console.log("HomePage", this.$route.query);
    await this.serverFetch();
    await this.serverSubmit();
  },
  methods: {
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