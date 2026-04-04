<template>
  <ion-page>
    <ion-header :translucent="true" v-if="isApp">
      <ion-toolbar>
        <ion-title>Posts</ion-title>
        <ion-buttons slot="primary">
          <ion-button color="primary" @click="showPostNew">
            <ion-icon slot="icon-only" :icon="ioniconsAdd"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-refresher slot="fixed" @ionRefresh="searchPosts(0, $event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <breadcrumb-bar :search="state.search" :breadcrumbs="state.breadcrumbs" @search="searchChanged"></breadcrumb-bar>
      <fab-button icon="add" @click="showPostNew" v-if="isWeb"></fab-button>
      <grid-cards label="posts" sm="1" md="2" lg="3" xl="4"
        :loading="state.loading" :limit="state.limit" 
        :count="state.count" :search="state.search" 
        @more="searchPosts(state.offset+state.limit)">
        <post-card :key="post.id" v-for="post of getPosts"
          :user="profile" :post="post" 
          @share="sharePost(post, $event)" 
          @click="showPostDetails(post.id)"></post-card>
      </grid-cards>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { isApp, isWeb } = useAppScreen();

const usersStore = useUsersStore();
const { loadProfile } = usersStore;
const { profile } = storeToRefs(usersStore);

const postsStore = usePostsStore();
const { loadItems: loadPosts } = postsStore;
const { getItems: getPosts } = storeToRefs(postsStore);

const { state, searchChanged, run: searchPosts } = useSearchPagination(loadPosts, "Problem Loading Posts");
state.breadcrumbs = [{ name: "posts", label: "Posts", path: "/posts" }];

async function loadData() {
  await loadProfile();
  await searchPosts();
}

onMounted(async () => {
  await loadData();
});
</script>

<style scoped lang="scss">

</style>
