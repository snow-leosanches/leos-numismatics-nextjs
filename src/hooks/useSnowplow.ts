import { useState, useEffect } from "react";

import { BrowserTracker, newTracker } from "@snowplow/browser-tracker";
import { SnowplowEcommercePlugin } from "@snowplow/browser-plugin-snowplow-ecommerce";
import { PerformanceNavigationTimingPlugin } from "@snowplow/browser-plugin-performance-navigation-timing";
import { SiteTrackingPlugin } from "@snowplow/browser-plugin-site-tracking";

export const useSnowplow = () => {
  const [tracker, setTracker] = useState<BrowserTracker>();

  useEffect(() => {
    if (!tracker) {
      // Initialize the Snowplow tracker.
      const _tracker = newTracker(
        "leos-numismatics-nextjs",
        String(process.env.NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL),
        {
          appId: "leos-numismatics-nextjs",
          contexts: {
            session: true,
            browser: true,
          },
          plugins: [
            PerformanceNavigationTimingPlugin(),
            SnowplowEcommercePlugin(),
            SiteTrackingPlugin(),
          ],
        }
      );

      if (_tracker) {
        setTracker(_tracker);
      }
    }
  }, []);

  return tracker;
}
