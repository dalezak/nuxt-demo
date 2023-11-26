import { defineStore } from 'pinia';

import Post from "../models/Post";
import Posts from "../models/Posts";

export const usePostStore = defineStore("posts", {
  state: () => ({
    post: null,
    posts: null
  }),
  getters: {
    getPosts(state) {
      return state.posts;
    },
    getPost(state) {
      return (post_id) => {
        if (state.posts && state.posts.length > 0 && post_id) {
          return state.posts.find(post => post.id == post_id);
        }
        return state.post;
      };
    }
  },
  actions: {
    async loadPosts({limit = 10, offset = 0, search = null}) {
      try {
        let posts = await Posts.load(limit, offset, search);
        if (posts) {
          await posts.store();
        }
        if (offset > 0) {
          if (this.posts == null) {
            this.posts = [];
          }
          this.posts = [...this.posts, ...posts];
        }
        else {
          this.posts = posts;
        }
        return Promise.resolve(posts);
      }
      catch (error) {
        return Promise.reject(error);
      }
    },
    async loadPost({id}) {
      try {
        console.log("Store.loadPost", id);
        let post = await Post.load(id);
        if (post) {
          await post.store();
        }
        this.post = post;
        return Promise.resolve(post);
      }
      catch (error) {
        return Promise.reject(error);
      }
    },
    async savePost({ title, body, image }) {
      try {
        let post = await new Post({
          title: title,
          body: body,
          image: image
        }).save();
        if (post) {
          await post.store();
        }
        if (this.posts == null) {
          this.posts = [];
        }
        this.post = post;
        this.posts = [...this.posts, ...[post]];
        return Promise.resolve(post);
      }
      catch (error) {
        return Promise.reject(error);
      }
    }
  }
});
