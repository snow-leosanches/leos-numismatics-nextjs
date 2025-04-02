import { ProductEntity } from "./product";

export class CartEntity {
    products: ProductEntity[];
    currency: string;

    constructor(products: ProductEntity[], currency: string) {
        this.products = products;
        this.currency = currency;
    }
}
