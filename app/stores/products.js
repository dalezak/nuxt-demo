import Product from "../models/Product";
import Products from "../models/Products";

export const useProductsStore = createSupaStore('products', Product, Products);
