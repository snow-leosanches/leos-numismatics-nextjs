"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { faker } from '@faker-js/faker';

import { useStore } from "@/store";
import { trackCheckoutCompletedSpec, trackCheckoutStartedSpec } from "../../../snowtype/snowplow";

export default function Checkout() {
  const cartStore = useStore();
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
      total: cartStore.products.reduce((acc, item) => acc + item.price * item.quantity, 0),
      context: cartStore.products.map((item) => ({
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

  if (cartStore.products.length === 0) {
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
      context: cartStore.products.map((item) => ({
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

        {cartStore.products.map((item) => (
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
            {cartStore.products.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
          </p>
        </div>

        <h1 className="text-xl">Shipping Information</h1>

        <div className="grid gap-4">
          <label className="flex flex-col">
            <span>Name</span>
            <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setCustomerName(e.target.value)} />
          </label>

          <label className="flex flex-col">
            <span>Address</span>
            <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setCustomerAddress(e.target.value)} />
          </label>

          <label className="flex flex-col">
            <span>City</span>
            <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setCustomerCity(e.target.value)} />
          </label>

          <label className="flex flex-col">
            <span>State</span>
            <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setCustomerState(e.target.value)} />
          </label>

          <label className="flex flex-col">
            <span>Zip Code</span>
            <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setCustomerZipCode(e.target.value)} />
          </label>

          <label className="flex flex-col">
            <span>Country</span>
            <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setCustomerCountry(e.target.value)} />
          </label>
        </div>

        <h1 className="text-xl">Payment Information</h1>
        <div className="grid gap-4">
          <label className="flex flex-col">
            <span>Payment Method</span>
            <select className="border border-gray-300 rounded p-2" onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="credit-card">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span>Shipping Method</span>
            <select className="border border-gray-300 rounded p-2" onChange={(e) => setShippingMethod(e.target.value)}>
              <option value="standard">Standard Shipping</option>
              <option value="express">Express Shipping</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span>Card Number</span>
            <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setCardNumber(e.target.value)} />
          </label>

          <label className="flex flex-col">
            <span>Expiration Date</span>
            <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setExpirationDate(e.target.value)} />
          </label>

          <label className="flex flex-col">
            <span>CVV</span>
            <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setCvv(e.target.value)} />
          </label>

          <label className="flex flex-col">
            <span>Billing Address</span>
            <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setBillingAddress(e.target.value)} />
          </label>

          <label className="flex flex-col">
            <span>Billing City</span>
            <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setBillingCity(e.target.value)} />
          </label>

          <label className="flex flex-col">
            <span>Billing State</span>
            <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setBillingState(e.target.value)} />
          </label>

          <label className="flex flex-col">
            <span>Billing Zip Code</span>
            <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setBillingZipCode(e.target.value)} />
          </label>

          <label className="flex flex-col">
            <span>Billing Country</span>
            <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => setBillingCountry(e.target.value)} />
          </label>
        </div>

        <div className="flex justify-center">
          <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" onClick={completePurchase}>
            Complete Purchase
          </button>
        </div>
      </div>
    </main>
  );
}
