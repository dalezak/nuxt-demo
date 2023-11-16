import Models from "./Models";
import Post from "./Post";

export default class Posts extends Models {

  constructor(models = []) {
    super(Post, models);
  }

  static async clear() {
    return Models.clearModel("posts");
  }

  static async load({limit = 10, offset = 0, search = ""}) {
    let clauses = [];
    let select = "*";
    if (search && search.length > 0) {
      clauses.push(["title", "ilike", search.toLowerCase()]);
    }
    return Models.loadModels(Posts, Post, "posts", "created_at:desc", limit, offset, clauses, select);
  }

}