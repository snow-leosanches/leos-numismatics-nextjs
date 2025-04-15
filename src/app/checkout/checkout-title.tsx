import { useEffect } from "react";
import { faker } from '@faker-js/faker';

import { trackCheckoutStartedSpec } from "../../../snowtype/snowplow";
import { useStore } from "@/store";

// Creating this to make linter happy.
export const CheckoutTitle: React.FunctionComponent = () => {
  const store = useStore();

  useEffect(() => {
    trackCheckoutStartedSpec({
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
    });
  }, []);

  return <div className="col gap-4 pb-8">
    <h1 className="text-2xl">Checkout</h1>
  </div>
}