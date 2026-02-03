import { newTracker } from "@snowplow/browser-tracker";
import { SnowplowEcommercePlugin } from "@snowplow/browser-plugin-snowplow-ecommerce";
import { PerformanceNavigationTimingPlugin } from "@snowplow/browser-plugin-performance-navigation-timing";
import { SiteTrackingPlugin } from "@snowplow/browser-plugin-site-tracking";

import {
  SignalsPlugin,
} from '@snowplow/signals-browser-plugin';

export const snowplowTracker = newTracker(
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
      SignalsPlugin(),
    ],
  }
);
