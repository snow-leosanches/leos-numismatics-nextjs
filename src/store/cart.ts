import { makeAutoObservable, action } from "mobx";
import { makePersistable } from 'mobx-persist-store';
import { faker } from "@faker-js/faker";

import { ProductEntity } from "./entities";
import { CartEntity } from "./entities/cart";
import {
  getDiscountAmount,
  type VoucherResultItem,
  type VoucherResultCart,
} from "@/components/voucher";

/** Stored voucher result (free type omits full product; product lives in cart) */
export type StoredVoucherResult =
  | VoucherResultItem
  | VoucherResultCart
  | { type: "free"; productId: string; catalogPrice: number };

export class CartStore {
  cartId: string;
  products: ProductEntity[];
  appliedVoucherCode: string | null;
  voucherResult: StoredVoucherResult | null;
  private _persistenceInitialized = false;
  private _stopPersisting?: () => void; // Store the cleanup function

  constructor() {
    this.cartId = faker.string.alphanumeric(16);
    this.products = [];
    this.appliedVoucherCode = null;
    this.voucherResult = null;
    makeAutoObservable(this);
    
    // Initialize persistence after a small delay to avoid render issues
    if (typeof window !== 'undefined') {
      setTimeout(() => this.initializePersistence(), 0);
    }
  }

  private async initializePersistence() {
    if (this._persistenceInitialized) return;
    this._persistenceInitialized = true;

    // Stop any existing persistence before creating a new one
    this.cleanup();

    try {
      // makePersistable returns a Promise, so we need to await it
      const persistStore = await makePersistable(
        this,
        {
          name: 'CartStore',
          properties: [{
            key: 'cartId',
            serialize: (value: string) => value,
            deserialize: (value: string) => value
          }, {
            key: 'products',
            serialize: (products: ProductEntity[]) => products.map(p => ({
              id: p.id,
              name: p.name,
              description: p.description,
              price: p.price,
              currency: p.currency,
              imageUrl: p.imageUrl,
              quantity: p.quantity
            })),
            deserialize: (data: any[]) => {
              if (!Array.isArray(data)) return [];
              return data.map(p => new ProductEntity(
                p.id, p.name, p.description, p.price, p.currency, p.imageUrl, p.quantity
              ));
            }
          }, {
            key: 'appliedVoucherCode',
            serialize: (value: string | null) => value,
            deserialize: (value: string | null) => value ?? null
          }, {
            key: 'voucherResult',
            serialize: (value: StoredVoucherResult | null) => value,
            deserialize: (value: StoredVoucherResult | null) => value ?? null
          }],
          expireIn: 86400000 * 7,
          removeOnExpiration: true,
          stringify: true,
          debugMode: false,
          storage: window.localStorage
        },
        { delay: 1000, fireImmediately: false },
      );

      // Store the cleanup function
      this._stopPersisting = persistStore.stopPersisting;
    } catch (error) {
      console.error('Failed to initialize persistence:', error);
      this._persistenceInitialized = false;
    }
  }

  // Cleanup method to stop persistence
  cleanup() {
    if (this._stopPersisting) {
      this._stopPersisting();
      this._stopPersisting = undefined;
      this._persistenceInitialized = false;
    }
  }

  get total() {
    return this.products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  }

  /** Discount amount in dollars from applied voucher (0 if none). */
  get discountAmount(): number {
    if (!this.voucherResult) return 0;
    return getDiscountAmount(this.voucherResult, this.total, this.products);
  }

  /** Subtotal after voucher discount (for display). */
  get totalAfterDiscount(): number {
    return Math.max(0, this.total - this.discountAmount);
  }

  setAppliedVoucher = action((code: string, result: StoredVoucherResult) => {
    this.appliedVoucherCode = code.trim().toUpperCase();
    this.voucherResult = result;
  });

  removeVoucher = action(() => {
    if (this.voucherResult?.type === "free" && this.voucherResult.productId) {
      const productId = this.voucherResult.productId;
      const index = this.products.findIndex((p) => p.id === productId);
      if (index !== -1) {
        if (this.products[index].quantity > 1) {
          this.products[index].quantity -= 1;
        } else {
          this.products.splice(index, 1);
        }
      }
    }
    this.appliedVoucherCode = null;
    this.voucherResult = null;
  });

  addProduct = action((product: ProductEntity) => {
    const existingProduct = this.products.find((p) => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      this.products.push(product);
    }
  });

  removeProduct = action((productId: string) => {
    const productIndex = this.products.findIndex((product) => product.id === productId);
    if (productIndex !== -1) {
      if (this.products[productIndex].quantity > 1) {
        this.products[productIndex].quantity -= 1;
      } else {
        this.products.splice(productIndex, 1);
      }
    }
  });

  setProducts = action((products: ProductEntity[]) => {
    this.products = products;
  });

  resetCart = action(() => {
    this.cartId = faker.string.alphanumeric(16);
    this.products = [];
    this.appliedVoucherCode = null;
    this.voucherResult = null;
  });

  hydrate = action((data: CartEntity) => {
    if (!data) return;
    this.setProducts(data.products);
  });
}