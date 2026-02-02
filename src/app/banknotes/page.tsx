"use client";

import { useEffect } from "react";
import { observer } from "mobx-react-lite";

import { trackPageView } from "@snowplow/browser-tracker";
import { trackProductListView } from "@snowplow/browser-plugin-snowplow-ecommerce";

// import { useSnowplow } from "@/hooks/useSnowplow";
import { BanknoteRow } from "./banknote-row";
import { Banknote, banknotes } from "./catalog";

export const dynamic = 'force-dynamic';

const Banknotes = () => {
  // Apprach 1: using hooks.
  /* const snowplowTracker = useSnowplow();

  useEffect(() => {
    snowplowTracker?.trackPageView();
  }, []); */

  // Approach 2: using `trackPageView` directly.
  useEffect(() => {
    trackPageView();
    trackProductListView({
      name: 'Banknotes Index',
      products: banknotes.map((banknote) => ({
        id: banknote.id,
        name: banknote.title,
        price: banknote.price,
        currency: 'USD',
        category: 'Banknotes'
      }))
    });
  }, []);

  return (
    <main className="container max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12">
      <header className="flex flex-col gap-2 pb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Catalog
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Our Banknotes
        </h1>
        <div className="h-px w-12 bg-midnight dark:bg-tahiti rounded-full mt-1" aria-hidden />
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {banknotes.map((banknote: Banknote) => (
          <BanknoteRow
            id={banknote.id}
            key={banknote.id}
            imageUrl={banknote.imageUrl}
            title={banknote.title}
            description={banknote.description}
            price={banknote.price}
          />
        ))}
      </div>
    </main>
  );
}

export default observer(Banknotes);