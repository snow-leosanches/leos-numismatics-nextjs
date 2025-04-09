"use client";

import { useRouter } from "next/navigation";

import { useStore } from "@/store";
import { ProductEntity } from "@/store/entities";

import { BanknoteInCart } from "./banknote-in-cart";
import { trackProductRemovedFromCartSpec } from "../../../snowtype/snowplow";

export default function YourCart() {
  const cartStore = useStore();
  const router = useRouter();

  const removeProduct = (productId: string, name: string, price: number, quantity: number) => {
    cartStore.removeProduct(productId);
    trackProductRemovedFromCartSpec({
      productId: productId,
      name: name,
      price: price,
      quantity: quantity,
    });
    router.refresh();
  }

  return (
    <main className="container grid justify-center pt-8">
      <div className="col gap-4 pb-8">
        <h1 className="text-2xl">Your Cart</h1>
      </div>

      {cartStore.products.length > 0 ? (
        <div className="grid gap-4">
          {cartStore.products.map((item: ProductEntity) => (
            <BanknoteInCart
              key={item.id}
              id={item.id}
              imageUrl={item.imageUrl}
              name={item.name}
              price={item.price}
              quantity={item.quantity}
              removeProduct={() => removeProduct(item.id, item.name, item.price, item.quantity)}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          <p>Your cart is empty.</p>
        </div>
      )}

    </main>
  );
}
