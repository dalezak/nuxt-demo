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
  ]
})
</script>