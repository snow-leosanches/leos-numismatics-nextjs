"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { observer } from "mobx-react-lite";

import { useStore } from "@/store";
import { ProductEntity } from "@/store/entities";
import { useBuildHref } from "@/hooks/useBuildHref";

import { BanknoteInCart } from "./banknote-in-cart";
// import { trackProductRemovedFromCartSpec } from "../../../snowtype/snowplow";
import { trackRemoveFromCart } from "@snowplow/browser-plugin-snowplow-ecommerce";

export const dynamic = 'force-dynamic';

const YourCartContent = () => {
  const store = useStore();
  const router = useRouter();
  const { buildHref } = useBuildHref();

  const removeProduct = (productId: string, name: string, price: number, quantity: number) => {
    if (store.cart.voucherResult?.type === "free" && store.cart.voucherResult.productId === productId) {
      store.cart.removeVoucher();
      router.refresh();
      return;
    }
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

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-end">
            <div className="flex flex-col gap-1 text-sm">
              {store.cart.discountAmount > 0 ? (
                <>
                  <span className="text-foreground/80">Subtotal: ${store.cart.total.toFixed(2)}</span>
                  <span className="text-green-600 dark:text-green-400">Discount: −${store.cart.discountAmount.toFixed(2)}</span>
                  <span className="text-lg font-semibold text-foreground pt-1">Total: ${store.cart.totalAfterDiscount.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-lg font-semibold text-foreground">Total: ${store.cart.total.toFixed(2)}</span>
              )}
            </div>
            <Link href={buildHref("/checkout")}>
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

const YourCart = observer(YourCartContent);

export default function YourCartPage() {
  return (
    <Suspense fallback={
      <main className="container grid justify-center pt-8">
        <div className="col gap-4 pb-8">
          <h1 className="text-2xl">Your Cart</h1>
        </div>
        <div className="grid gap-4">
          <p>Loading...</p>
        </div>
      </main>
    }>
      <YourCart />
    </Suspense>
  );
}