"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import { observer } from "mobx-react-lite";
import { faker } from '@faker-js/faker';

import { useStore } from "@/store";
import { ProductEntity } from "@/store/entities";
import { applyVoucher } from "@/components/voucher";
import { banknotes } from "@/app/banknotes/catalog";
// import { trackCheckoutCompletedSpec } from "../../../snowtype/snowplow";
import { trackVoucherAppliedSpec } from "../../../snowtype/snowplow";
import { trackTransaction } from "@snowplow/browser-plugin-snowplow-ecommerce";
import { ShippingInformation } from "./shipping-information";
import { PaymentInformation } from "./payment-information";
import { CheckoutTitle } from "./checkout-title";
import { snowplowTracker } from "@/components/snowplow-tracker";

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

  const handleApplyVoucher = () => {
    setVoucherError(null);
    const result = applyVoucher(
      voucherCodeInput,
      store.cart.products.map((p) => ({ id: p.id, price: p.price, quantity: p.quantity })),
      catalogForVoucher
    );
    if (result.type === "error") {
      setVoucherError(result.message);
      return;
    }
    const appliedCode = voucherCodeInput.trim().toUpperCase();

    if (result.type === "free") {
      store.cart.addProduct(
        new ProductEntity(
          result.product.id,
          result.product.name,
          result.product.description,
          result.product.price,
          result.product.currency,
          result.product.imageUrl,
          result.product.quantity
        )
      );
      store.cart.setAppliedVoucher(appliedCode, {
        type: "free",
        productId: result.product.id,
        catalogPrice: result.catalogPrice,
      });
    } else {
      store.cart.setAppliedVoucher(appliedCode, result);
    }

    const discountAmount =
      result.type === "item"
        ? (() => {
            const line = store.cart.products.find((p) => p.id === result.productId);
            return line ? (line.price * line.quantity * result.percent) / 100 : 0;
          })()
        : result.type === "cart"
          ? (store.cart.total * result.percent) / 100
          : result.catalogPrice;

    trackVoucherAppliedSpec({
      code: appliedCode,
      discount_amount: discountAmount,
      ...(result.type === "free" && { free_product_id: result.product.id }),
    });

    setVoucherCodeInput("");
  };

  const handleRemoveVoucher = () => {
    store.cart.removeVoucher();
    setVoucherError(null);
  };

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

  // Fetch voucher eligibility from Snowplow Signals (count_purchases in last 7 days)
  useEffect(() => {
    if (!persistenceLoaded || !store.user.userId) {
      setVoucherEligible(null);
      return;
    }
    const params = new URLSearchParams({
      attribute_key: "count_purchases",
      identifier: store.user.userId,
      name: "leos_numismatics_user_id_attribute_service",
    });
    fetch(`/api/service-attributes?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Service attributes: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        // Response may be attributes object or { attributes } or nested by group
        const attrs = data?.attributes ?? data;
        const count =
          typeof attrs?.count_purchases === "number"
            ? attrs.count_purchases
            : typeof attrs?.leos_numismatics_user_attribute_group?.count_purchases === "number"
              ? attrs.leos_numismatics_user_attribute_group.count_purchases
              : 0;
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

  const subtotal = store.cart.total;
  const discount = store.cart.discountAmount;
  const shipping = 10;
  const tax = 5;
  const total = Math.max(0, subtotal - discount) + shipping + tax;
  const voucherResult = store.cart.voucherResult;

  const getLineDiscount = (itemId: string): number | null => {
    if (voucherResult?.type !== "item" || voucherResult.productId !== itemId) return null;
    const line = store.cart.products.find((p) => p.id === itemId);
    if (!line) return null;
    const lineTotal = line.price * line.quantity;
    return (lineTotal * voucherResult.percent) / 100;
  };

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

          <div
            className={
              voucherEligible === false
                ? "rounded-xl border-2 border-amber-300 dark:border-amber-600 bg-amber-50/80 dark:bg-amber-950/40 p-5 shadow-sm"
                : "rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 p-5 shadow-sm"
            }
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
              Voucher
            </h2>
            {store.cart.appliedVoucherCode ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-foreground">
                  Code <strong>{store.cart.appliedVoucherCode}</strong> applied.
                  {voucherResult?.type === "item" && (
                    <span className="text-neutral-500 dark:text-neutral-400"> Single item {voucherResult.percent}% off.</span>
                  )}
                  {voucherResult?.type === "cart" && (
                    <span className="text-neutral-500 dark:text-neutral-400"> Cart {voucherResult.percent}% off.</span>
                  )}
                  {voucherResult?.type === "free" && (
                    <span className="text-neutral-500 dark:text-neutral-400"> Free item added.</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveVoucher}
                  className="text-sm font-medium text-foreground underline hover:no-underline"
                >
                  Remove
                </button>
              </div>
            ) : voucherEligible === false ? (
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200" role="status">
                Vouchers are not available at this time.
              </p>
            ) : voucherEligible === true ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={voucherCodeInput}
                  onChange={(e) => setVoucherCodeInput(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 min-w-0 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-foreground placeholder:text-neutral-400"
                  aria-label="Voucher code"
                />
                <button
                  type="button"
                  onClick={handleApplyVoucher}
                  className="rounded-full border border-solid border-transparent bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90"
                >
                  Apply
                </button>
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Checking voucher availability…</p>
            )}
            {voucherError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
                {voucherError}
              </p>
            )}
          </div>
        </div>

        {/* Order summary - on small: second (after form); on lg: right column, sticky */}
        <aside className="lg:sticky lg:top-8 h-fit lg:row-span-2 lg:row-start-1 lg:col-start-2">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-700">
              Order summary
            </h2>
            <ul className="flex flex-col gap-4 mb-5">
              {store.cart.products.map((item) => {
                const lineTotal = item.price * item.quantity;
                const lineDiscount = getLineDiscount(item.id);
                const displayTotal = lineDiscount != null ? lineTotal - lineDiscount : lineTotal;
                const isFreeLine = voucherResult?.type === "free" && voucherResult.productId === item.id;
                return (
                  <li key={item.id} className="flex gap-3">
                    <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-md bg-neutral-200 dark:bg-neutral-700">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={80}
                        height={56}
                        className="object-cover h-full w-full"
                      />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {isFreeLine ? (
                          "Free item"
                        ) : (
                          <>${item.price.toFixed(2)} × {item.quantity}</>
                        )}
                      </span>
                      {voucherResult?.type === "item" && voucherResult.productId === item.id && (
                        <span className="text-xs text-green-600 dark:text-green-400">{voucherResult.percent}% off</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground tabular-nums">
                      ${displayTotal.toFixed(2)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="space-y-2 pt-3 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex justify-between text-sm text-foreground/80">
                <span>Subtotal</span>
                <span className="tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span className="tabular-nums">−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-foreground/80">
                <span>Shipping</span>
                <span className="tabular-nums">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-foreground/80">
                <span>Tax</span>
                <span className="tabular-nums">${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-lg font-semibold text-foreground tabular-nums">${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>

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
