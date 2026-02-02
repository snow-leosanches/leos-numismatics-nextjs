import { useEffect } from "react";
// import { faker } from '@faker-js/faker';

 // import { trackCheckoutStartedSpec } from "../../../snowtype/snowplow";
 import { trackCheckoutStep } from "@snowplow/browser-plugin-snowplow-ecommerce";
import { useStore } from "@/store";

// Creating this to make linter happy.
export const CheckoutTitle: React.FunctionComponent = () => {
  const store = useStore();

  useEffect(() => {
    // Track using "Checkout Step" event from the Snowplow Ecommerce Plugin
    trackCheckoutStep({
      step: 1,
      account_type: store.user.userId ? 'registered' : 'guest',
      billing_full_address: `${store.user.address}, ${store.user.city}, ${store.user.state}, ${store.user.zipCode}, ${store.user.country}`,
      shipping_full_address: `${store.user.address}, ${store.user.city}, ${store.user.state}, ${store.user.zipCode}, ${store.user.country}`,
      payment_method: 'credit-card',
    });

    // Track using events defined in the Data Product
    /* trackCheckoutStartedSpec({
      cart_id: faker.string.alpha(16),
      timestamp: new Date().getTime(),
      context: store.cart.products.map((item) => ({
        schema: "iglu:com.snplow.sales.aws/ecommerce_product/jsonschema/2-0-0",
        data: {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          currency: item.currency,
          category: "banknotes",
        }
      }))
    }); */
  }, []);

  return (
    <div className="flex flex-col gap-2 pb-6">
      <p className="text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        Secure checkout
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Checkout
      </h1>
      <div className="h-px w-12 bg-midnight dark:bg-tahiti rounded-full mt-1" aria-hidden />
    </div>
  );
}