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

<script>
import routes from "@/mixins/routes";
import ionic from "@/mixins/ionic";

import { mapState, mapActions } from 'pinia';

import { useUserStore } from '@/stores/users';
import { usePostStore } from '@/stores/posts';

export default {
  name: 'PostDetails',
  mixins: [
    routes,
    ionic
  ],
  setup() {
    definePageMeta({
      title: 'Post'
    })
  },
  computed: {
    ...mapState(useUserStore, ['user', 'getUser']),
    ...mapState(usePostStore, ['post', 'getPost']),
  },
  async mounted() {
    try {
      await this.loadPost({ 
        id: this.$route.params.id
      });
    }
    catch (error) {
      this.showError("Problem Loading Post", error.message);
    }
  },
  methods: {
    ...mapActions(usePostStore, ['loadPost']),
    async sharePost(post) {
      console.log("sharePost", post);
    }
  }
}
</script>

<style scoped lang="scss">

</style>
