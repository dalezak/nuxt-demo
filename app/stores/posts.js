import Post from "../models/Post";
import Posts from "../models/Posts";

export const usePostsStore = createSupaStore('posts', Post, Posts);
