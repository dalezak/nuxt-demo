<template>
  <ion-page>
    <ion-header :translucent="true" v-if="isMobile">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/posts"></ion-back-button>
        </ion-buttons>
        <ion-title>Posts</ion-title>
        <ion-buttons slot="primary" v-if="post">
          <ion-button @click="sharePost">
            <ion-icon slot="icon-only" :icon="ioniconsShareOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <top-bar :breadcrumbs="breadcrumbs"></top-bar>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end" v-if="isWeb">
        <ion-fab-button @click="sharePost">
          <ion-icon :icon="ioniconsShareOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <ion-card class="ion-margin" v-if="post">
        <ion-card-header>
          <ion-card-title v-if="post.title">{{post.title}}</ion-card-title>
        </ion-card-header>
        <ion-card-content v-if="post.body">{{post.body}}</ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  title: 'Post'
})

const { isMobile, isWeb } = usePlatform();

const { params } = useRoute();

const breadcrumbs = [
  {
    name: "posts",
    label: "Posts",
    path: "/posts"
  },
  {
    name: "post",
    label: "Post",
    path: `/posts/${params.id}`
  }
];

const postStore = usePostStore();
const { post } = storeToRefs(postStore);
const { loadPost } = postStore;

async function sharePost(event) {
  showPopoverShare(event, {
    title: post.title,
    description: post.body
  })
}

try {
  await loadPost({ 
    id: params.id
  });
}
catch (error) {
  showWarning("Problem Loading Post", error.message);
}
</script>

<style scoped lang="scss">

</style>
