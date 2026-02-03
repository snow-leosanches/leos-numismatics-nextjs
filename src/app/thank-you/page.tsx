"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";

import { useStore } from "@/store";

export const dynamic = 'force-dynamic';

const ThankYou = () => {
  const store = useStore();

  useEffect(() => {
    store.cart.resetCart();
  }, [store]);

  return (
    <main className="container grid justify-center pt-8">
      <div className="col gap-4 pb-8">
        <h1 className="text-2xl">Thank You for Your Order!</h1>
        <p>Your order has been successfully placed.</p>
      </div>
    </main>
  );
}

export default observer(ThankYou);
