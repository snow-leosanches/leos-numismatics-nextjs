import React from 'react';
import { AnalyticsContext } from '@/contexts';

/* export const useSnowplow = () => {
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
} */



// Create an analytics hook that we can use with other components.
export const useSnowplow = () => {
  const result = React.useContext(AnalyticsContext);
  if (!result) {
    throw new Error("Context used outside of its Provider!");
  }
  return result;
};
