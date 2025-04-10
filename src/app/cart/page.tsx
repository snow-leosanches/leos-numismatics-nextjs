"use client";

import { useRouter } from "next/navigation";

import { useStore } from "@/store";
import { ProductEntity } from "@/store/entities";

import { BanknoteInCart } from "./banknote-in-cart";
import { trackProductRemovedFromCartSpec } from "../../../snowtype/snowplow";
import Link from "next/link";

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

          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Total: ${cartStore.products.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</p>
            <Link href="/checkout">
              <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          <p>Your cart is empty.</p>
        </div>
      )}

    </main>
  );
}
