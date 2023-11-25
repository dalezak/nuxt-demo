import RestModels from "./RestModels";
import Product from "./Product";

export default class Products extends RestModels {

  constructor(models = []) {
    super(Product, models);
  }

  static async clear() {
    return RestModels.clearModel("products");
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