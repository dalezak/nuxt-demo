import SupaModels from "../nuxt-layer-supabase/models/SupaModels";
import Post from "./Post";

export default class Posts extends SupaModels {

  constructor(models = []) {
    super(Post, models);
  }

  static async clear() {
    return SupaModels.clearModel("posts");
  }

  static async load(limit = 10, offset = 0, search = "") {
    let where = [];
    if (search && search.length > 0) {
      where.push(["title", "ilike", search.toLowerCase()]);
    }
    return SupaModels.loadModels(Posts, Post, "posts", {
      sort: "created_at:desc", 
      limit: limit, 
      offset: offset, 
      where: where
    });
  }

}