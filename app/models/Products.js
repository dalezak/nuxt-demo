import RestModels from "../../../nuxt-supabase/app/models/RestModels";
import Product from "./Product";

export default class Products extends RestModels {

  constructor(models = []) {
    super(Product, models);
  }

  static async clear() {
    return RestModels.clearModels("products");
  }

  static async load(limit = 10, offset = 0, search = "", sort = "desc") {
    const url = `https://fakestoreapi.com/products`;
    const params = {
      limit: limit,
      sort: sort
    };
    return RestModels.loadModels(Products, Product, url, params);
  }

}