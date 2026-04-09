import SupaModels from "../../../nuxt-supabase/app/models/SupaModels";
import Post from "./Post";

export default class Posts extends SupaModels {

  constructor(models = []) {
    super(Post, models);
  }

  static async clear() {
    return this.clearModels("posts");
  }

  static async stored(search = "", _params = {}) {
    return this.storedModels("posts/", search);
  }

  static async restore(limit = 10, offset = 0, search = "", _params = {}) {
    return this.restoreModels(Posts, Post, "posts/", search, offset, limit, "-created_at");
  }

  static async load(limit = 10, offset = 0, search = "", _params = {}) {
    let where = [];
    if (search && search.length > 0) {
      where.push(["title", "ilike", search.toLowerCase()]);
    }
    return this.loadModels(Posts, Post, "posts", {
      order: "created_at:desc",
      limit: limit,
      offset: offset,
      where: where
    });
  }

}