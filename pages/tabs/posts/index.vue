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
      <top-bar :search="state.search" :breadcrumbs="state.breadcrumbs" @search="searchChanged"></top-bar>
      <fab-button icon="add" @click="showPostNew" v-if="isWeb"></fab-button>
      <grid-cards label="posts"
        :loading="state.loading" :limit="state.limit" 
        :count="state.count" :search="state.search" 
        @more="searchPosts(offset+limit)">
        <post-card :key="post.id" v-for="post of getPosts"
          :user="profile" :post="post" 
          @share="sharePost(post)" @click="showPostDetails(post.id)"></post-card>
      </grid-cards>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { isApp, isWeb } = useAppScreen();

const state = reactive({
  limit: 12,
  offset: 0,
  count: 0,
  search: "",
  loading: false,
  breadcrumbs: [
    {
      name: "posts",
      label: "Posts",
      path: "/posts"
    }
  ]
});

const usersStore = useUsersStore();
const { loadProfile } = usersStore;
const { profile } = storeToRefs(usersStore);

const postsStore = usePostsStore();
const { loadPosts } = postsStore;
const { getPosts } = storeToRefs(postsStore);

function searchChanged(search = "") {
  state.search = search;
  searchPosts();
}

async function searchPosts(offset = 0, event = null) {
  try {
    state.loading = true;
    state.offset = offset;
    let posts = await loadPosts({
      limit: state.limit, 
      offset: state.offset, 
      search: state.search
    });
    state.count = posts ? posts.length : 0;
  }
  catch (error) {
    consoleError("searchPosts", error);
    showError("Problem Loading Posts", error.message);
  }
  finally {
    state.loading = false;
    if (event && event.target) {
      event.target.complete();
    }
  }
}

async function sharePost(post) {
  shareSocial(post.title, post.body);
}

async function loadData() {
  await loadProfile();
  await searchPosts();
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
