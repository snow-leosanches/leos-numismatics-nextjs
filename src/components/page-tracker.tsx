'use client';

// import { useRouter } from "next/router";
import { useEffect } from "react";
import { snowplowTracker } from "./snowplow-tracker";

export function PageTracker() {
  // const router = useRouter();

  useEffect(() => {
    if (snowplowTracker) {
      snowplowTracker.trackPageView();
    } else {
      console.warn("Snowplow tracker is not defined");
    }

    /* router.events.on("routeChangeComplete", () => {
      snowplowTracker?.trackPageView();
    });

    return () => {
      router.events.off("routeChangeComplete", () => {
        snowplowTracker?.trackPageView();
      });
    }; */
  // }, [router.events]);
}, []);

  return null;
}
