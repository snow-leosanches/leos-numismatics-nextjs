"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { trackAddToCart } from "@snowplow/browser-plugin-snowplow-ecommerce";

import { useStore } from "@/store";

export interface BanknoteRowProps {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
}

const BanknoteRowContent: React.FunctionComponent<BanknoteRowProps> = (props) => {
  const store = useStore();
  const searchParams = useSearchParams();

  const buildHrefWithUtmOnly = (path: string): string => {
    const params = new URLSearchParams();
    const utmParams = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

    utmParams.forEach((param) => {
      const value = searchParams.get(param);
      if (value) params.set(param, value);
    });

    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
  };

  const addToCart = () => {
    store.cart.addProduct({
      id: props.id,
      name: props.title,
      price: props.price,
      quantity: 1,
      imageUrl: props.imageUrl,
      description: props.description,
      currency: "USD",
    });

    // Track using "Add to Cart" event from the Snowplow Ecommerce Plugin
    trackAddToCart({
      cart_id: store.cart.cartId,
      currency: "USD",
      total_value: store.cart.total,
      products: [
        {
          id: props.id,
          name: props.title,
          price: props.price,
          quantity: 1,
          currency: "USD",
          category: "Banknotes",
        },
      ],
    });

    // Track using events defined in the Data Product
    /* trackProductAddedToCartSpec({
      productId: selectedBanknote.id,
      name: selectedBanknote.title,
      price: selectedBanknote.price,
      quantity: 1
    }); */

    alert(`${props.title} has been added to your cart.`);
  };

  const descriptionSnippet =
    props.description.length > 120 ? `${props.description.slice(0, 120).trim()}…` : props.description;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={buildHrefWithUtmOnly(`/banknotes/${props.id}`)}
        className="relative block aspect-[3/2] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-700"
      >
        <Image
          src={props.imageUrl}
          alt={props.title}
          width={360}
          height={240}
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-1 flex-col gap-1">
          <Link
            href={buildHrefWithUtmOnly(`/banknotes/${props.id}`)}
            className="font-semibold text-foreground hover:text-midnight dark:hover:text-tahiti transition-colors line-clamp-2"
          >
            {props.title}
          </Link>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
            {descriptionSnippet}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
          <span className="text-lg font-semibold text-foreground tabular-nums">
            ${props.price.toFixed(2)}
          </span>
          <div className="flex gap-2">
            <Link
              href={buildHrefWithUtmOnly(`/banknotes/${props.id}`)}
              className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-3 py-2 text-sm font-medium text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              View details
            </Link>
            <button
              type="button"
              onClick={addToCart}
              className="rounded-lg bg-foreground text-background px-3 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

const BanknoteRowSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50">
    <div className="aspect-[3/2] w-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
    <div className="flex flex-1 flex-col gap-3 p-4">
      <div className="h-5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      <div className="flex items-center justify-between gap-3 pt-3 mt-2 border-t border-neutral-200 dark:border-neutral-700">
        <div className="h-6 w-16 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-9 w-24 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          <div className="h-9 w-24 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

export const BanknoteRow: React.FunctionComponent<BanknoteRowProps> = (props) => (
  <Suspense fallback={<BanknoteRowSkeleton />}>
    <BanknoteRowContent {...props} />
  </Suspense>
);
