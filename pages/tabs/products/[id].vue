<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/posts"></ion-back-button>
        </ion-buttons>
        <ion-title>Posts</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="sharePost(post)">
            <ion-icon slot="icon-only" :icon="ioniconsShareOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-card class="ion-margin" v-if="post">
        <ion-card-header>
          <ion-card-title>{{post.title}}</ion-card-title>
        </ion-card-header>
        <ion-card-content>{{post.body}}</ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  title: 'Post'
})

const route = useRoute();

const { getPosts } = storeToRefs(postStore);
const { loadPost } = postStore;

async function sharePost(post) {
  console.log("sharePost", post);
}

try {
  await this.loadPost({ 
    id: route.params.id
  });
}
catch (error) {
  showWarning("Problem Loading Post", error.message);
}
</script>

<style scoped lang="scss">

</style>
