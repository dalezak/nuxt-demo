<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Posts</ion-title>
        <ion-buttons slot="primary">
          <ion-button color="primary" @click="showPostForm">
            <ion-icon slot="icon-only" :icon="ioniconsAdd"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <grid-cards :loading="loading" :limit="limit" :count="count" :search="search" label="posts" @more="searchPosts(offset+limit)">
        <post-card :user="user" :post="post" @share="sharePost(post)" @click="showPostDetails(post.id)" :key="post.id" v-for="post of posts"></post-card>
      </grid-cards>
    </ion-content>
  </ion-page>
</template>

<script>
import routes from "@/mixins/routes";
import ionic from "@/mixins/ionic";

import { mapState, mapActions } from 'pinia';

import { useUserStore } from '@/stores/users';
import { usePostStore } from '@/stores/posts';

export default {
  name: 'PostList',
  mixins: [
    routes,
    ionic
  ],
  setup() {
    definePageMeta({
      title: 'Posts'
    })
  },
  data() {
    return {
      limit: 12,
      offset: 0,
      count: 0,
      search: "",
      loading: false
    }
  },
  computed: {
    ...mapState(useUserStore, ['user', 'getUser']),
    ...mapState(usePostStore, ['posts', 'getPosts']),
  },
  async mounted() {
    await this.searchPosts();
  },
  methods: {
    ...mapActions(usePostStore, ['loadPosts']),
    searchChanged(search) {
      this.search = search;
      this.searchPosts();
    },
    async searchPosts(offset = 0) {
      try {
        this.loading = true;
        this.offset = offset;
        let posts = await this.loadPosts({
          limit: this.limit, 
          offset: this.offset, 
          search: this.search
        });
        this.count = posts ? posts.length : 0;
      }
      catch (error) {
        this.showError("Problem Loading Posts", error.message);
      }
      finally {
        this.loading = false;
      }
    },
    async showPostForm() {
      console.log("showPostForm");
    },
    showPostDetails(id) {
      console.log("showPostDetails", id);
    },
    async sharePost(post) {
      console.log("sharePost", post);
    }
  }
}
</script>

<style scoped lang="scss">

</style>
