"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

const Checkout = () => {
  const store = useStore();
  const router = useRouter();

  const [customerName, setCustomerName] = useState(faker.person.fullName());
  const [customerAddress, setCustomerAddress] = useState(faker.location.streetAddress());
  const [customerCity, setCustomerCity] = useState(store.user.city || "123");
  const [customerState, setCustomerState] = useState(store.user.state || "123");
  const [customerZipCode, setCustomerZipCode] = useState(store.user.zipCode || "123");
  const [customerCountry, setCustomerCountry] = useState(store.user.country || "123");
  const [cardNumber, setCardNumber] = useState("123");
  const [expirationDate, setExpirationDate] = useState("123");
  const [cvv, setCvv] = useState("123");
  const [billingAddress, setBillingAddress] = useState("123");
  const [billingCity, setBillingCity] = useState(faker.location.city());
  const [billingState, setBillingState] = useState(faker.location.state());
  const [billingZipCode, setBillingZipCode] = useState(faker.location.zipCode());
  const [billingCountry, setBillingCountry] = useState('USA');
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [shippingMethod, setShippingMethod] = useState("standard");

  useEffect(() => {
    if (!store.user.userId) {
      const email = faker.internet.email();
      store.user.setUserId(email);
      store.user.setName(customerName);
      store.user.setEmail(email);
      store.user.setAddress(customerAddress);
      store.user.setCity(billingCity);
      store.user.setState(billingState);
      store.user.setZipCode(billingZipCode);
      store.user.setCountry(billingCountry);

      snowplowTracker?.setUserId(email);

      trackCustomerIdentificationSpec({
        email: email,
        phone: faker.phone.number()
      });
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
      }))
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

      <div className="grid gap-4">
        <h1 className="text-xl">Order Summary</h1>

        {store.cart.products.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <img src={item.imageUrl} alt={item.name} className="w-16 h-16" />
            <div className="flex flex-col">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
            <span>Quantity: {item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">
            Total: $
            {store.cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
          </p>
        </div>

        <ShippingInformation
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerAddress={customerAddress}
          setCustomerAddress={setCustomerAddress}
          customerCity={customerCity}
          setCustomerCity={setCustomerCity}
          customerState={customerState}
          setCustomerState={setCustomerState}
          customerZipCode={customerZipCode}
          setCustomerZipCode={setCustomerZipCode}
          customerCountry={customerCountry}
          setCustomerCountry={setCustomerCountry}
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
          billingAddress={billingAddress}
          setBillingAddress={setBillingAddress}
          billingCity={billingCity}
          setBillingCity={setBillingCity}
          billingState={billingState}
          setBillingState={setBillingState}
          billingZipCode={billingZipCode}
          setBillingZipCode={setBillingZipCode}
          billingCountry={billingCountry}
          setBillingCountry={setBillingCountry}
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
