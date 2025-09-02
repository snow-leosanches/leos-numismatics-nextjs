"use client";

import { use, useEffect } from "react";
import Image from "next/image";
import { observer } from "mobx-react-lite";

import { banknotes } from "../catalog";
// import { trackProductAddedToCartSpec } from "../../../../snowtype/snowplow";
import { trackAddToCart, trackProductView } from "@snowplow/browser-plugin-snowplow-ecommerce";
import { useStore } from "@/store";

export interface BanknoteDetailsProps {
  params: Promise<{ id: string }>;
}

const BanknoteDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const store = useStore();

  const selectedBanknote = banknotes.find((banknote) => banknote.id === id);
  if (!selectedBanknote) {
    return <div>Banknote not found</div>;
  }

  useEffect(() => {
    trackProductView({
      id: selectedBanknote.id,
      name: selectedBanknote.title,
      price: selectedBanknote.price,
      currency: 'USD',
      category: 'Banknotes'
    });
  }, [selectedBanknote]);

  const addToCart = () => {
    store.cart.addProduct({
      id: selectedBanknote.id,
      name: selectedBanknote.title,
      price: selectedBanknote.price,
      quantity: 1,
      imageUrl: selectedBanknote.imageUrl,
      description: selectedBanknote.description,
      currency: 'USD'
    });

    // Track using "Add to Cart" event from the Snowplow Ecommerce Plugin
    trackAddToCart({
      cart_id: store.cart.cartId,
      currency: 'USD',
      total_value: store.cart.total,
      products: [{
        id: selectedBanknote.id,
        name: selectedBanknote.title,
        price: selectedBanknote.price,
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
    
    alert(`${selectedBanknote.title} has been added to your cart.`);
  }

  return <main className="container grid justify-center pt-8 px-4">
    <div className="col gap-4 pb-8">
      <h1 className="text-2xl">{selectedBanknote.title}</h1>
    </div>

    <div className="grid gap-4">
      <div className="pb-4">
        <Image
          src={selectedBanknote.imageUrl}
          alt={selectedBanknote.title}
          width={720}
          height={480}
        />

        <div className="py-4">
          <h2 className="text-xl py-4">Details</h2>
          <p>{selectedBanknote.description}</p>
        </div>

        <div className="py-4">
          <h2 className="text-xl py-4">Price</h2>
          <p>${selectedBanknote.price.toFixed(2)}</p>
        </div>

        <div className="py-4">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            onClick={addToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </main>
}

export default observer(BanknoteDetails);