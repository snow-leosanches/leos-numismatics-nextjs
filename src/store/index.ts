export * from './cart';

// we need to enable static rendering for prevent rerender on server side and leaking memory
import { enableStaticRendering } from "mobx-react-lite";
import { useState, useEffect } from 'react';
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

// Hook for using store - Fixed version
export function useStore(initData?: CartEntity) {
  const [store, setStore] = useState(() => {
    // Only initialize on server or first client render
    if (typeof window === "undefined") {
      return initStore(initData);
    }
    return null;
  });

  useEffect(() => {
    // Initialize store on client after component mounts
    if (typeof window !== "undefined" && !store) {
      const clientStore = initStore(initData);
      setStore(clientStore);
    }
  }, [initData, store]);

  // Return the initialized store, or initStore() so we reuse the same singleton
  // (avoids creating new CartStore on every render and duplicate makePersistable "CartStore" warnings)
  return store || initStore(initData);
}