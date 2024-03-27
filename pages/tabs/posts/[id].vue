<template>
  <ion-page>
    <ion-header :translucent="true" v-if="isApp">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/posts"></ion-back-button>
        </ion-buttons>
        <ion-title>Posts</ion-title>
        <ion-buttons slot="primary" v-if="post">
          <ion-button @click="sharePost(post)">
            <ion-icon slot="icon-only" :icon="ioniconsShareOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <top-bar :breadcrumbs="state.breadcrumbs"></top-bar>
      <fab-button icon="share" @click="sharePost" v-if="isWeb"></fab-button>
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
  middleware: 'auth'
})

const { isApp, isWeb } = useAppScreen();

const { params } = useAppRoute();

const state = reactive({
  breadcrumbs: [
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
  ]
});

const postsStore = usePostsStore();
const { loadPost } = postsStore;
const { post } = storeToRefs(postsStore);

async function loadData() {
  await loadPost({ 
    id: params.id
  });
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
