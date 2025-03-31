"use client";

import { use, useEffect } from "react";
import { useSnowplow } from "@/hooks/useSnowplow";

export default function BanknoteDetails({ params }: { params: Promise<{ id: string }> }) {
  const snowplowTracker = useSnowplow();
  const { id } = use(params);

  useEffect(() => {
    if (snowplowTracker) {
      snowplowTracker.trackPageView();
    }
  }, [snowplowTracker]);

  return <>{id}</>;
}
