import RestModels from "../../../nuxt-supabase/app/models/RestModels";
import Product from "./Product";

export default class Products extends RestModels {

  constructor(models = []) {
    super(Product, models);
  }

  static async clear() {
    return this.clearModels("products");
  }

  static async stored(search = "", _params = {}) {
    return this.storedModels("products/", search);
  }

  static async restore(limit = 10, offset = 0, search = "", _params = {}) {
    return this.restoreModels(Products, Product, "products/", search, offset, limit);
  }

  static async load(limit = 10, _offset = 0, _search = "", params = {}) {
    const url = `https://fakestoreapi.com/products`;
    const fetchParams = {
      limit: limit,
      sort: params.sort ?? "desc"
    };
    return this.loadModels(Products, Product, url, fetchParams);
  }

}