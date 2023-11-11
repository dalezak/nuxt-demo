import Models from "./Models";
import User from "./User";

export default class Users extends Models {

  constructor(models = []) {
    super(User, models);
  }

  static async clear() {
    return Models.clearModel("users");
  }

  static async load(limit = 10, after = null, search = "") {
    let query = [];
    if (search && search.length > 0) {
      query.push(["words", "array-contains-any", search.toLowerCase().split(" ")]);
    }
    return Models.loadModels(Users, User, "users", "created:desc", limit, after, query);
  }

}