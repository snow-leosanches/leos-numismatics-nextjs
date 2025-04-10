export * from './cart';

// we need to enable static rendering for prevent rerender on server side and leaking memory
import { enableStaticRendering } from "mobx-react-lite";
import { CartStore } from './cart';
import { CartEntity } from './entities/cart';
import { UserStore } from './user';

// enable static rendering ONLY on server
enableStaticRendering(typeof window === "undefined")

// init a client store that we will send to client (one store for client)
let cartStore: CartStore;
let userStore: UserStore;

const initStore = (initData?: CartEntity) => {
  // check if we already declare store (client Store), otherwise create one
  const store = { 
    cart: cartStore ?? new CartStore(),
    user: userStore ?? new UserStore()
  };

  // hydrate to store if receive initial data
  if (initData) {
    store.cart.hydrate(initData);
  }

  // Create a store on every server request
  if (typeof window === "undefined") return store;
  // Otherwise it's client, remember this store and return 
  if (!cartStore) cartStore = store.cart;
  if (!userStore) userStore = store.user;
  return store;
}

// Hook for using store
export function useStore(initData?: CartEntity) {
  return initStore(initData)
}