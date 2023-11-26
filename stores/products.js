import { defineStore } from 'pinia';

import Product from "../models/Product";
import Products from "../models/Products";

export const useProductStore = defineStore("products", {
  state: () => ({
    product: null,
    products: null
  }),
  getters: {
    getProducts(state) {
      return state.products;
    },
    getProduct(state) {
      return (product_id) => {
        if (state.products && state.products.length > 0 && product_id) {
          return state.products.find(product => product.id == product_id);
        }
        return state.product;
      };
    }
  },
  actions: {
    async loadProducts({limit = 10, offset = 0, search = null}) {
      try {
        let products = await Products.load(limit, offset, search);
        if (products) {
          await products.store();
        }
        if (offset > 0) {
          if (this.products == null) {
            this.products = [];
          }
          this.products = [...this.products, ...products];
        }
        else {
          this.products = products;
        }
        return Promise.resolve(products);
      }
      catch (error) {
        return Promise.reject(error);
      }
    },
    async loadProduct({id}) {
      try {
        console.log("Store.loadProduct", id);
        let product = await Product.load(id);
        if (product) {
          await product.store();
        }
        this.product = product;
        return Promise.resolve(product);
      }
      catch (error) {
        return Promise.reject(error);
      }
    },
    async saveProduct({ title, body, image }) {
      try {
        let product = await new Product({
          title: title,
          body: body,
          image: image
        }).save();
        if (product) {
          await product.store();
        }
        if (this.products == null) {
          this.products = [];
        }
        this.product = product;
        this.products = [...this.products, ...[product]];
        return Promise.resolve(product);
      }
      catch (error) {
        return Promise.reject(error);
      }
    }
  }
});
