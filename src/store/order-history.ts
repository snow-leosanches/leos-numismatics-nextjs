import { makeAutoObservable, action } from "mobx";
import { makePersistable } from 'mobx-persist-store';

export type OrderProduct = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  currency: string;
  imageUrl: string;
};

export type OrderRecord = {
  id: string;
  date: string;
  products: OrderProduct[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  shippingMethod: string;
};

export class OrderHistoryStore {
  orders: OrderRecord[] = [];
  private _persistenceInitialized = false;
  private _stopPersisting?: () => void;

  constructor() {
    makeAutoObservable(this);
    if (typeof window !== 'undefined') {
      setTimeout(() => this.initializePersistence(), 0);
    }
  }

  private async initializePersistence() {
    if (this._persistenceInitialized) return;
    this._persistenceInitialized = true;
    this.cleanup();

    try {
      const persistStore = await makePersistable(
        this,
        {
          name: 'OrderHistoryStore',
          properties: [{
            key: 'orders',
            serialize: (orders: OrderRecord[]) => orders,
            deserialize: (orders: OrderRecord[]) => Array.isArray(orders) ? orders : []
          }],
          expireIn: 86400000 * 365,
          removeOnExpiration: true,
          stringify: true,
          debugMode: false,
          storage: window.localStorage
        },
        { delay: 1000, fireImmediately: false }
      );
      this._stopPersisting = persistStore.stopPersisting;
    } catch (error) {
      console.error('Failed to initialize OrderHistoryStore persistence:', error);
      this._persistenceInitialized = false;
    }
  }

  cleanup() {
    if (this._stopPersisting) {
      this._stopPersisting();
      this._stopPersisting = undefined;
      this._persistenceInitialized = false;
    }
  }

  addOrder = action((order: OrderRecord) => {
    this.orders.unshift(order);
  });
}
