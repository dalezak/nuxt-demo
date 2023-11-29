import RestModel from './RestModel';

export default class Product extends RestModel {

  id = null;

  title = null;
  description = null;
  
  image = null;
  price = null;
  category = null;
  
  constructor(data = {}) {
    super(data);
    Object.assign(this, data);
  }

  async store() {
    return await this.storeModel(`products/${this.id}`);
  }

  static async restore(id) {
    return await RestModel.restoreModel(Product, `products/${id}`);
  }

  static async load(id, params = {}) {
    const url = `https://fakestoreapi.com/products/${id}`;
    return await RestModel.loadModel(Product, url, params);
  }

  async save() {
    const values = this.getValues(["title", "description", "image", "price", "category"]);
    const url = this.id != null ? `https://fakestoreapi.com/products/${this.id}` : `https://fakestoreapi.com/products`;
    return await this.saveModel(Product, url, values);
  }

}