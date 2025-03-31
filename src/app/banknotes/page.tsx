"use client";

import { useEffect } from "react";
import { useSnowplow } from "@/hooks/useSnowplow";

import { BanknoteRow } from "./banknote-row";
import { Banknote, banknotes } from "./catalog";

export default function Banknotes() {
  const snowplowTracker = useSnowplow();

  useEffect(() => {
    if (snowplowTracker) {
      snowplowTracker.trackPageView();
    }
  }, [snowplowTracker]);

  return <main className="container grid justify-center pt-8">
    <div className="col gap-4 pb-8">
      <h1 className="text-2xl">Our Banknotes</h1>
    </div>

    <div className="grid gap-4">
      {banknotes.map((banknote: Banknote) => (
        <BanknoteRow
          id={banknote.id}
          key={banknote.id}
          imageUrl={banknote.imageUrl}
          altText={banknote.altText}
          description={banknote.description}
          price={banknote.price}
        />
      ))}
    </div>
  </main>
}
