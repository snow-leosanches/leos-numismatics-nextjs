import { makeAutoObservable } from "mobx";
import { faker } from "@faker-js/faker";

import { ProductEntity } from "./entities";
import { CartEntity } from "./entities/cart";

export class CartStore {
  cartId: string;
  products: ProductEntity[];

  constructor() {
    this.cartId = faker.string.alphanumeric(16);
    this.products = [];
    makeAutoObservable(this);
  }

  get total() {
    return this.products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  }

  setProducts(products: ProductEntity[]) {
    this.products = products;
  }

  addProduct(product: ProductEntity) {
    const existingProduct = this.products.find((p) => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      this.products.push(product);
    }
  }

  removeProduct(productId: string) {
    const productIndex = this.products.findIndex((product) => product.id === productId);
    if (productIndex !== -1) {
      this.products[productIndex].quantity -= 1;
      if (this.products[productIndex].quantity <= 0) {
        this.products.splice(productIndex, 1);
      }
    }
  }

  hydrate = (data: CartEntity) => {
    if (!data) return;
    this.setProducts(data.products);
  }
}