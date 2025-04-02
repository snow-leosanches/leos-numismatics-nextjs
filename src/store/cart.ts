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

  removeProduct(productId: number) {
    this.products = this.products.filter((product) => product.id !== productId);
  }

  // if data is provided set this data to BooksStore 
  hydrate = (data: CartEntity) => {
    if (!data) return;
    this.setProducts(data.products);
  }
}