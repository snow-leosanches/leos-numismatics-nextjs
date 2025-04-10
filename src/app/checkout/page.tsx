"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { faker } from '@faker-js/faker';

import { useStore } from "@/store";
import { trackCheckoutCompletedSpec, trackCheckoutStartedSpec } from "../../../snowtype/snowplow";
import { ShippingInformation } from "./shipping-information";
import { PaymentInformation } from "./payment-information";

export default function Checkout() {
  const store = useStore();
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerState, setCustomerState] = useState("");
  const [customerZipCode, setCustomerZipCode] = useState("");
  const [customerCountry, setCustomerCountry] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingZipCode, setBillingZipCode] = useState("");
  const [billingCountry, setBillingCountry] = useState("");
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [orderNotes, setOrderNotes] = useState("");

  const completePurchase = () => {
    trackCheckoutCompletedSpec({
      total: store.cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0),
      billing_city: billingCity,
      billing_state: billingState,
      billing_country: billingCountry,
      shipping_city: customerCity,
      shipping_state: customerState,
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
    });
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

  return (
    <main className="container grid justify-center pt-8">
      <div className="col gap-4 pb-8">
        <h1 className="text-2xl">Checkout</h1>
      </div>

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
          setCustomerName={setCustomerName}
          setCustomerAddress={setCustomerAddress}
          setCustomerCity={setCustomerCity}
          setCustomerState={setCustomerState}
          setCustomerZipCode={setCustomerZipCode}
          setCustomerCountry={setCustomerCountry}
        />

        <PaymentInformation
          setPaymentMethod={setPaymentMethod}
          setShippingMethod={setShippingMethod}
          setCardNumber={setCardNumber}
          setExpirationDate={setExpirationDate}
          setCvv={setCvv}
          setBillingAddress={setBillingAddress}
          setBillingCity={setBillingCity}
          setBillingState={setBillingState}
          setBillingZipCode={setBillingZipCode}
          setBillingCountry={setBillingCountry}
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
