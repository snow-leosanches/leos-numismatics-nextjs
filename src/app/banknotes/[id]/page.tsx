"use client";

import { use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { observer } from "mobx-react-lite";

import { banknotes } from "../catalog";
import { trackAddToCart, trackProductView } from "@snowplow/browser-plugin-snowplow-ecommerce";
import { useStore } from "@/store";

export interface BanknoteDetailsProps {
  params: Promise<{ id: string }>;
}

const BanknoteDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const store = useStore();

  const selectedBanknote = banknotes.find((banknote) => banknote.id === id);

  useEffect(() => {
    if (selectedBanknote) {
      trackProductView({
        id: selectedBanknote.id,
        name: selectedBanknote.title,
        price: selectedBanknote.price,
        currency: "USD",
        category: "Banknotes",
      });
    }
  }, [selectedBanknote]);

  if (!selectedBanknote) {
    return (
      <main className="container max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-12">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-foreground mb-2">Banknote not found</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">
            The banknote you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/banknotes"
            className="inline-flex items-center justify-center rounded-lg bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Back to catalog
          </Link>
        </div>
      </main>
    );
  }

  const addToCart = () => {
    store.cart.addProduct({
      id: selectedBanknote.id,
      name: selectedBanknote.title,
      price: selectedBanknote.price,
      quantity: 1,
      imageUrl: selectedBanknote.imageUrl,
      description: selectedBanknote.description,
      currency: "USD",
    });

    // Track using "Add to Cart" event from the Snowplow Ecommerce Plugin.
    trackAddToCart({
      cart_id: store.cart.cartId,
      currency: "USD",
      total_value: store.cart.total,
      products: [
        {
          id: selectedBanknote.id,
          name: selectedBanknote.title,
          price: selectedBanknote.price,
          quantity: 1,
          currency: "USD",
          category: "Banknotes",
        },
      ],
    });

    // Track using events defined in the Tracking Plan
    /* trackProductAddedToCartSpec({
      productId: selectedBanknote.id,
      name: selectedBanknote.title,
      price: selectedBanknote.price,
      quantity: 1
    }); */

    alert(`${selectedBanknote.title} has been added to your cart.`);
  };

  return (
    <main className="container max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-12">
      <Link
        href="/banknotes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-foreground mb-6 transition-colors"
      >
        <span aria-hidden>←</span> Back to banknotes
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-10">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 aspect-[3/2]">
            <Image
              src={selectedBanknote.imageUrl}
              alt={selectedBanknote.title}
              width={720}
              height={480}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
              {selectedBanknote.title}
            </h1>
            <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
              ${selectedBanknote.price.toFixed(2)}
            </p>
          </header>

          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 p-5 shadow-sm"
            aria-labelledby="details-heading"
          >
            <h2 id="details-heading" className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
              Details
            </h2>
            <p className="text-foreground leading-relaxed">{selectedBanknote.description}</p>
          </section>

          <div className="mt-auto pt-4">
            <button
              type="button"
              onClick={addToCart}
              className="w-full rounded-lg bg-foreground text-background py-3 px-4 text-base font-medium hover:opacity-90 transition-opacity sm:w-auto sm:min-w-[200px]"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default observer(BanknoteDetails);
