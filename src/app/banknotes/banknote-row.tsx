"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import { trackAddToCart } from "@snowplow/browser-plugin-snowplow-ecommerce";

import { useStore } from "@/store";
import { useBuildHref } from "@/hooks/useBuildHref";

export interface BanknoteRowProps {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
}

const BanknoteRowContent: React.FunctionComponent<BanknoteRowProps> = (props) => {
  const store = useStore();
  const { buildHref } = useBuildHref();

  const addToCart = () => {
    store.cart.addProduct({
      id: props.id,
      name: props.title,
      price: props.price,
      quantity: 1,
      imageUrl: props.imageUrl,
      description: props.description,
      currency: 'USD'
    });

    // Track using "Add to Cart" event from the Snowplow Ecommerce Plugin
    trackAddToCart({
      cart_id: store.cart.cartId,
      currency: 'USD',
      total_value: store.cart.total,
      products: [{
        id: props.id,
        name: props.title,
        price: props.price,
        quantity: 1,
        currency: 'USD',
        category: 'Banknotes'
      }]
    });

    // Track using events defined in the Data Product
    /* trackProductAddedToCartSpec({
      productId: selectedBanknote.id,
      name: selectedBanknote.title,
      price: selectedBanknote.price,
      quantity: 1
    }); */
    
    alert(`${props.title} has been added to your cart.`);
  }

  return <div className="items-center pb-4 grid grid-cols-1 gap-4 md:flex">
    <div className="flex flex-col gap-2" style={{ minWidth: '180px', height: '120px', position: 'relative' }}>
      <Image
        src={props.imageUrl}
        alt={props.title}
        width={180}
        height={120}
      />
    </div>
    <div className="flex flex-col gap-2">
      <h2 className="text-lg">{props.title}</h2>
      <p className="text-sm text-gray-500">{props.description}</p>
      <p className="text-md text-gray-500 font-bold">Price: ${props.price.toFixed(2)}</p>
      <div className="flex gap-2">
        <Link href={buildHref(`/banknotes/${props.id}`)} className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
          View Details
        </Link>
        <button 
          onClick={addToCart}
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
}

export const BanknoteRow: React.FunctionComponent<BanknoteRowProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="items-center pb-4 grid grid-cols-1 gap-4 md:flex">
        <div className="flex flex-col gap-2" style={{ minWidth: '180px', height: '120px', position: 'relative' }}>
          <div className="w-[180px] h-[120px] bg-gray-200 animate-pulse" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-64 bg-gray-200 animate-pulse rounded" />
          <div className="h-5 w-24 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    }>
      <BanknoteRowContent {...props} />
    </Suspense>
  );
}