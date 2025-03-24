import { BrowserTracker, newTracker, trackPageView } from "@snowplow/browser-tracker";
import { useState, useEffect } from "react";

export const useSnowplow = () => {
  const [tracker, setTracker] = useState<BrowserTracker>();

  useEffect(() => {
    // Initialize the Snowplow tracker.
    const _tracker = newTracker("leos-numismatics-nextjs", String(process.env.NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL), {appId: "leos-numismatics-nextjs"});
    if (_tracker) {
      setTracker(_tracker);
    }
  }, []);

  return tracker;
}
