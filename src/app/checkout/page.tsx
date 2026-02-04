"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { observer } from "mobx-react-lite";
import { faker } from '@faker-js/faker';

import { useStore } from "@/store";
import { banknotes } from "@/app/banknotes/catalog";
// import { trackCheckoutCompletedSpec } from "../../../snowtype/snowplow";
import { trackTransaction } from "@snowplow/browser-plugin-snowplow-ecommerce";
import { ShippingInformation } from "./shipping-information";
import { PaymentInformation } from "./payment-information";
import { CheckoutTitle } from "./checkout-title";
import { VoucherInformation } from "./voucher-information";
import { OrderSummary } from "./order-summary";

export const dynamic = 'force-dynamic';

// Helper function to extract UTM parameters from search params
const extractUtmParams = (searchParams: URLSearchParams): string => {
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const params = new URLSearchParams();
  
  utmParams.forEach(param => {
    const value = searchParams.get(param);
    if (value) {
      params.set(param, value);
    }
  });
  
  return params.toString();
};

const CheckoutContent = () => {
  const store = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [persistenceLoaded, setPersistenceLoaded] = useState(false);

  const expirationDateArray = faker.date.future().toISOString().slice(0, 7).split("-");
  const [cardNumber, setCardNumber] = useState(faker.finance.creditCardNumber());
  const [expirationDate, setExpirationDate] = useState(expirationDateArray[1] + "/" + expirationDateArray[0]);
  const [cvv, setCvv] = useState(faker.number.int({ min: 100, max: 999 }).toString());
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [voucherCodeInput, setVoucherCodeInput] = useState("");
  const [voucherError, setVoucherError] = useState<string | null>(null);
  // Voucher eligibility from Signals: null = loading, true = eligible (no purchases in last 7 days), false = ineligible
  const [voucherEligible, setVoucherEligible] = useState<boolean | null>(null);

  const catalogForVoucher = banknotes.map((b) => ({
    id: b.id,
    title: b.title,
    description: b.description,
    price: b.price,
    imageUrl: b.imageUrl,
  }));

  useEffect(() => {
    // Wait for persistence to load from localStorage
    const timer = setTimeout(() => {
      setPersistenceLoaded(true);
    }, 1500); // Slightly longer than the persistence delay

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only check after persistence has loaded
    if (persistenceLoaded && !store.user.userId) {
      // Extract UTM parameters and include them in the returnUrl
      const utmParams = extractUtmParams(searchParams);
      const returnUrl = utmParams ? `/checkout?${utmParams}` : '/checkout';
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [store.user.userId, persistenceLoaded, router, searchParams]);

  // Fetch voucher eligibility from Snowplow Signals (count_purchases from attribute group)
  useEffect(() => {
    if (!persistenceLoaded || !store.user.userId) {
      setVoucherEligible(null);
      return;
    }
    const params = new URLSearchParams({
      attribute_key: "user_id",
      identifier: store.user.userId,
      name: "leos_numismatics_user_attribute_group",
      version: "2",
      attributes: "count_purchases",
    });
    fetch(`/api/attribute-groups?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Attribute group: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        const count =
          typeof data?.count_purchases === "number" ? data.count_purchases : 0;
        setVoucherEligible(count === 0);
      })
      .catch(() => {
        // On error (e.g. no profile yet), treat as eligible so we don't block vouchers
        setVoucherEligible(true);
      });
  }, [persistenceLoaded, store.user.userId]);

  const completePurchase = () => {
    const shippingAmount = 10;
    const taxAmount = 5;
    const finalTotal = store.cart.totalAfterDiscount + shippingAmount + taxAmount;
    // Track using "Checkout Step" event from the Snowplow Ecommerce Plugin
    trackTransaction({
      currency: 'USD',
      payment_method: paymentMethod,
      shipping: shippingAmount,
      tax: taxAmount,
      revenue: finalTotal,
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

    // Track using events defined in the Tracking Plan
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
      <main className="container max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-12">
        <div className="flex flex-col gap-4 pb-8">
          <h1 className="text-2xl font-semibold text-foreground">Checkout</h1>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 p-8 text-center shadow-sm">
          <p className="text-foreground/80 mb-4">Your cart is empty.</p>
          <a
            href="/banknotes"
            className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Browse banknotes
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="container max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12">
      <CheckoutTitle />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10 lg:grid-rows-[1fr_auto]">
        {/* Form column - on small: first; on lg: left column row 1 */}
        <div className="flex flex-col gap-6 min-w-0 lg:row-start-1 lg:col-start-1">
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

          <VoucherInformation
            voucherEligible={voucherEligible}
            voucherCodeInput={voucherCodeInput}
            setVoucherCodeInput={setVoucherCodeInput}
            voucherError={voucherError}
            setVoucherError={setVoucherError}
            catalogForVoucher={catalogForVoucher}
          />
        </div>

        {/* Order summary - on small: second (after form); on lg: right column, sticky */}
        <OrderSummary />

        {/* Complete purchase - on small: third (after order summary); on lg: left column row 2 */}
        <div className="flex justify-center lg:justify-start pt-2 lg:row-start-2 lg:col-start-1">
          <button
            type="button"
            onClick={completePurchase}
            className="w-full sm:w-auto rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:opacity-90 font-medium text-sm sm:text-base h-12 px-8 min-w-[200px]"
          >
            Complete purchase
          </button>
        </div>
      </div>
    </main>
  );
}

const Checkout = observer(CheckoutContent);

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="container max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-12">
          <div className="flex flex-col gap-2 pb-6">
            <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            <div className="h-8 w-32 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-10 w-full rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            <div className="h-10 w-full rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
            <div className="h-10 w-1/2 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          </div>
        </main>
      }
    >
      <Checkout />
    </Suspense>
  );
}
