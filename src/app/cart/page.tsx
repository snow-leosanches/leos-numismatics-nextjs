"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { observer } from "mobx-react-lite";

import { useStore } from "@/store";
import { ProductEntity } from "@/store/entities";

import { BanknoteInCart } from "./banknote-in-cart";
// import { trackProductRemovedFromCartSpec } from "../../../snowtype/snowplow";
import { trackRemoveFromCart } from "@snowplow/browser-plugin-snowplow-ecommerce";

const YourCart = () => {
  const store = useStore();
  const router = useRouter();

  const removeProduct = (productId: string, name: string, price: number, quantity: number) => {
    store.cart.removeProduct(productId);
    // Track using "Remove from Cart" event from the Snowplow Ecommerce Plugin
    trackRemoveFromCart({
      cart_id: store.cart.cartId,
      currency: 'USD',
      total_value: store.cart.total,
      products: [{
        id: productId,
        name: name,
        price: price,
        quantity: 1,
        currency: 'USD',
        category: 'Banknotes'
      }],
    });
    // Track using events defined in the Data Product
    /* trackProductRemovedFromCartSpec({
      productId: productId,
      name: name,
      price: price,
      quantity: quantity,
    }); */
    router.refresh();
  }

  return (
    <main className="container grid justify-center pt-8">
      <div className="col gap-4 pb-8">
        <h1 className="text-2xl">Your Cart</h1>
      </div>

      {store.cart.products.length > 0 ? (
        <div className="grid gap-4">
          {store.cart.products.map((item: ProductEntity) => (
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
            <p className="text-lg font-semibold">Total: ${store.cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</p>
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

export default observer(YourCart);