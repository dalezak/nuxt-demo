<template>
  <ion-page>
    <ion-header :translucent="true" v-if="isMobile">
      <ion-toolbar>
        <ion-title>Posts</ion-title>
        <ion-buttons slot="primary">
          <ion-button color="primary" @click="showPagePostNew">
            <ion-icon slot="icon-only" :icon="ioniconsAdd"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <top-bar :search="search" :breadcrumbs="breadcrumbs" @search="searchPosts(0)"></top-bar>
      <ion-fab slot="fixed" vertical="bottom" horizontal="end" v-if="isWeb">
        <ion-fab-button @click="showPageProductNew">
          <ion-icon :icon="ioniconsAdd"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <grid-cards :loading="loading" :limit="limit" :count="count" :search="search" label="posts" @more="searchPosts(offset+limit)">
        <post-card :user="getUser" :post="post" @share="sharePost(post)" @click="showPagePost(post.id)" :key="post.id" v-for="post of getPosts"></post-card>
      </grid-cards>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { isMobile, isWeb } = usePlatform();

const breadcrumbs = [
  {
    name: "posts",
    label: "Posts",
    path: "/posts"
  }
];

const limit = 12;
let offset = $ref(0);
let count = $ref(0);
let search = $ref("");
let loading = $ref(false);

const userStore = useUserStore();
const postStore = usePostStore();

const { getUser } = storeToRefs(userStore);
const { getPosts } = storeToRefs(postStore);
const { loadPosts } = postStore;

function searchChanged(_search) {
  search = _search;
  searchPosts();
}

async function searchPosts(_offset = 0) {
  try {
    loading = true;
    offset = _offset;
    let posts = await loadPosts({
      limit: limit, 
      offset: offset, 
      search: search
    });
    count = posts ? posts.length : 0;
  }
  catch (error) {
    showWarning("Problem Loading Posts", error.message);
  }
  finally {
    loading = false;
  }
}

async function showPostForm() {
  console.log("showPostForm");
}

function showPostDetails(id) {
  console.log("showPostDetails", id);
}

async function sharePost(post) {
  console.log("sharePost", post);
}

searchChanged();
</script>

<style scoped lang="scss">

</style>
