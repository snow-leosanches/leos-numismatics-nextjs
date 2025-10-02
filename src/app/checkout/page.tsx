"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { observer } from "mobx-react-lite";
import { faker } from '@faker-js/faker';

import { useStore } from "@/store";
// import { trackCheckoutCompletedSpec } from "../../../snowtype/snowplow";
import { trackTransaction } from "@snowplow/browser-plugin-snowplow-ecommerce";
import { ShippingInformation } from "./shipping-information";
import { PaymentInformation } from "./payment-information";
import { CheckoutTitle } from "./checkout-title";
import { snowplowTracker } from "@/components/snowplow-tracker";
import { trackCustomerIdentificationSpec } from "../../../snowtype/snowplow";

export const dynamic = 'force-dynamic';

const Checkout = () => {
  const store = useStore();
  const router = useRouter();

  const expirationDateArray = faker.date.future().toISOString().slice(0, 7).split("-");
  const [cardNumber, setCardNumber] = useState(faker.finance.creditCardNumber());
  const [expirationDate, setExpirationDate] = useState(expirationDateArray[1] + "/" + expirationDateArray[0]);
  const [cvv, setCvv] = useState(faker.number.int({ min: 100, max: 999 }).toString());
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [shippingMethod, setShippingMethod] = useState("standard");

  useEffect(() => {
    if (!store.user.userId) {
      const email = faker.internet.email();
      store.user.setUserId(email);
      store.user.setEmail(email);
      store.user.setName(faker.person.fullName());
      store.user.setAddress(faker.location.streetAddress());
      store.user.setCity(faker.location.city());
      store.user.setState(faker.location.state());
      store.user.setZipCode(faker.location.zipCode());
      store.user.setCountry(faker.location.country());

      snowplowTracker?.setUserId(email);

      trackCustomerIdentificationSpec({
        email: email,
        phone: faker.phone.number()
      });

      router.refresh();
    }
  }, [store.user]);

  const completePurchase = () => {
    // Track using "Checkout Step" event from the Snowplow Ecommerce Plugin
    trackTransaction({
      currency: 'USD',
      payment_method: paymentMethod,
      shipping: 10,
      tax: 5,
      revenue: store.cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0) + 15,
      transaction_id: faker.string.alphanumeric(16),
      products: store.cart.products.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        currency: item.currency,
        category: 'Banknotes'
      })),
      context: [{
        schema: "iglu:com.leosnumismatics/demographics/jsonschema/1-0-0",
        data: {
          city: store.user.city,
          state: store.user.state,
          country: store.user.country,
          zip_code: store.user.zipCode
        }
      }]
    });

    // Track using events defined in the Data Product
    /* trackCheckoutCompletedSpec({
      total: store.cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0),
      billing_city: billingCity,
      billing_state: billingState,
      billing_country: billingCountry,
      shipping_city: customerCity,
      shipping_state: customerState,
      customer_name: customerName,
      context: store.cart.products.map((item) => ({
        schema: "iglu:com.snplow.sales.aws/ecommerce_product/jsonschema/2-0-0",
        data: {
          item_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          currency: item.currency
        }
      }))
    }); */
    router.push("/thank-you");
  }

  if (store.cart.products.length === 0) {
    return (
      <main className="container grid justify-center pt-8">
        <div className="col gap-4 pb-8">
          <h1 className="text-2xl">Checkout</h1>
        </div>

        <div className="grid gap-4">
          <p>Your cart is empty.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container grid justify-center pt-8">
      <CheckoutTitle />

      <div className="grid gap-4 m-8">
        <div className="col gap-4 pb-8">
          <h1 className="text-xl">Order Summary</h1>
        </div>

        <div className="col gap-4 pb-8">
          {store.cart.products.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex flex-col gap-2" style={{ minWidth: '90px', height: '60px', position: 'relative' }}>
              <Image src={item.imageUrl} alt={item.name} width={90} height={60} />
            </div>
            <div className="flex flex-col">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
              <span>Quantity: {item.quantity}</span>
            </div>
          </div>
        ))}
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">
            Total: $
            {store.cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
          </p>
        </div>

        <ShippingInformation
          customerName={store.user.name}
          setCustomerName={(e) => store.user.setName(e)}
          customerAddress={store.user.address}
          setCustomerAddress={(e) => store.user.setAddress(e)}
          customerCity={store.user.city}
          setCustomerCity={(e) => store.user.setCity(e)}
          customerState={store.user.state}
          setCustomerState={(e) => store.user.setState(e)}
          customerZipCode={store.user.zipCode}
          setCustomerZipCode={(e) => store.user.setZipCode(e)}
          customerCountry={store.user.country}
          setCustomerCountry={(e) => store.user.setCountry(e)}
        />

        <PaymentInformation
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          shippingMethod={shippingMethod}
          setShippingMethod={setShippingMethod}
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          expirationDate={expirationDate}
          setExpirationDate={setExpirationDate}
          cvv={cvv}
          setCvv={setCvv}
          billingAddress={store.user.address}
          setBillingAddress={(e) => store.user.setAddress(e)}
          billingCity={store.user.city}
          setBillingCity={(e) => store.user.setCity(e)}
          billingState={store.user.state}
          setBillingState={(e) => store.user.setState(e)}
          billingZipCode={store.user.zipCode}
          setBillingZipCode={(e) => store.user.setZipCode(e)}
          billingCountry={store.user.country}
          setBillingCountry={(e) => store.user.setCountry(e)}
          billingSameAsShipping={billingSameAsShipping}
          setBillingSameAsShipping={setBillingSameAsShipping}
        />

        <div className="flex justify-center">
          <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" onClick={completePurchase}>
            Complete Purchase
          </button>
        </div>
      </div>
    </main>
  );
}

export default observer(Checkout);
