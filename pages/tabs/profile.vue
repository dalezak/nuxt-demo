<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="showUserLogout" title="Logout">
            <ion-icon slot="icon-only" :icon="ioniconsLogOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button router-link="/about" router-direction="forward">View About</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import routes from "@/mixins/routes";
export default defineComponent({
  name: 'ProfilePage',
  mixins: [
    routes
  ]
})
</script>