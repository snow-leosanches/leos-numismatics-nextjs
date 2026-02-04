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
    // Track using events defined in the Tracking Plan
    /* trackProductRemovedFromCartSpec({
      productId: productId,
      name: name,
      price: price,
      quantity: quantity,
    }); */
    router.refresh();
  }

  return (
    <main className="container max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-12">
      <header className="flex flex-col gap-2 pb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Shopping
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Your Cart
        </h1>
        <div className="h-px w-12 bg-midnight dark:bg-tahiti rounded-full mt-1" aria-hidden />
      </header>

      {store.cart.products.length > 0 ? (
        <div className="flex flex-col gap-6">
          <ul className="flex flex-col gap-4 list-none p-0 m-0">
            {store.cart.products.map((item: ProductEntity) => (
              <li key={item.id}>
                <BanknoteInCart
                  id={item.id}
                  imageUrl={item.imageUrl}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  removeProduct={() => removeProduct(item.id, item.name, item.price, item.quantity)}
                />
              </li>
            ))}
          </ul>

          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/30 p-5 sm:p-6"
            aria-label="Order summary"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
              <div className="flex flex-col gap-1.5 text-sm">
                {store.cart.discountAmount > 0 ? (
                  <>
                    <div className="flex justify-between gap-4 text-foreground/80">
                      <span>Subtotal</span>
                      <span>${store.cart.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-green-600 dark:text-green-400">
                      <span>Discount</span>
                      <span>−${store.cart.discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-base font-semibold text-foreground pt-2 border-t border-neutral-200 dark:border-neutral-600 mt-2">
                      <span>Total</span>
                      <span>${store.cart.totalAfterDiscount.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between gap-4 text-base font-semibold text-foreground">
                    <span>Total</span>
                    <span>${store.cart.total.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <Link href={buildHref("/checkout")} className="shrink-0">
                <button
                  type="button"
                  className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-11 sm:h-12 px-5 sm:px-6 w-full sm:w-auto min-w-[140px]"
                >
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </section>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/30 p-10 sm:p-12 text-center">
          <div className="max-w-sm mx-auto flex flex-col gap-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400" aria-hidden>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Your cart is empty</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Add collectible banknotes from our catalog to get started.
              </p>
            </div>
            <Link
              href={buildHref("/banknotes")}
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 bg-transparent text-foreground font-medium text-sm h-10 px-5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Browse Banknotes
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

const YourCart = observer(YourCartContent);

export default function YourCartPage() {
  return (
    <Suspense fallback={
      <main className="container max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-12">
        <header className="flex flex-col gap-2 pb-8">
          <p className="text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Shopping</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Your Cart</h1>
          <div className="h-px w-12 bg-midnight dark:bg-tahiti rounded-full mt-1" aria-hidden />
        </header>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/30 p-8 text-center text-neutral-500 dark:text-neutral-400">
          Loading...
        </div>
      </main>
    }>
      <YourCart />
    </Suspense>
  );
}