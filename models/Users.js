import SupaModels from "./SupaModels";
import User from "./User";

export default class Users extends SupaModels {

  constructor(models = []) {
    super(User, models);
  }

  static async clear() {
    return SupaModels.clearModel("users");
  }

  static async load(limit = 10, offset = 0, search = "") {
    let where = [];
    if (search && search.length > 0) {
      where.push(["name", "ilike", search.toLowerCase()]);
    }
    return SupaModels.loadModels(Users, User, "users", { 
      order: "created_at:desc", 
      limit: limit, 
      offset: offset, 
      where: where
    });
  }

}