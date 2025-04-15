"use client";

import { useEffect } from "react";
import { trackPageView } from "@snowplow/browser-tracker";

// import { useSnowplow } from "@/hooks/useSnowplow";
import { BanknoteRow } from "./banknote-row";
import { Banknote, banknotes } from "./catalog";

export default function Banknotes() {
  // Apprach 1: using hooks.
  /* const snowplowTracker = useSnowplow();

  useEffect(() => {
    snowplowTracker?.trackPageView();
  }, []); */

  // Approach 2: using `trackPageView` directly.
  useEffect(() => {
    trackPageView();
  }, []);

  return <main className="container grid justify-center pt-8 px-4">
    <div className="col gap-4 pb-8">
      <h1 className="text-2xl">Our Banknotes</h1>
    </div>

    <div className="grid gap-4">
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
}
