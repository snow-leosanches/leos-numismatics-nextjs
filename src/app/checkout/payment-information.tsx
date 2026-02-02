export interface PaymentInformationProps {
  cardNumber: string;
  setCardNumber: (cardNumber: string) => void;
  expirationDate: string;
  setExpirationDate: (expirationDate: string) => void;
  cvv: string;
  setCvv: (cvv: string) => void;
  billingAddress: string;
  setBillingAddress: (billingAddress: string) => void;
  billingCity: string;
  setBillingCity: (billingCity: string) => void;
  billingState: string;
  setBillingState: (billingState: string) => void;
  billingZipCode: string;
  setBillingZipCode: (billingZipCode: string) => void;
  billingCountry: string;
  setBillingCountry: (billingCountry: string) => void;
  billingSameAsShipping: boolean;
  setBillingSameAsShipping: (billingSameAsShipping: boolean) => void;
  paymentMethod: string;
  setPaymentMethod: (paymentMethod: string) => void;
  shippingMethod: string;
  setShippingMethod: (shippingMethod: string) => void;
}

const inputBase =
  "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-foreground px-3 py-2.5 text-sm transition-colors placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-midnight/30 dark:focus:ring-tahiti/40 focus:border-midnight dark:focus:border-tahiti";

const labelBase = "text-sm font-medium text-foreground mb-1.5 block";

export const PaymentInformation: React.FC<PaymentInformationProps> = (props) => {
  return (
    <section
      className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 p-6 shadow-sm"
      aria-labelledby="payment-heading"
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-midnight/10 dark:bg-tahiti/20 text-midnight dark:text-tahiti text-sm font-semibold" aria-hidden>
          2
        </span>
        <h2 id="payment-heading" className="text-xl font-semibold text-foreground">
          Payment & delivery
        </h2>
      </div>

      <div className="grid gap-6">
        {/* Payment method */}
        <div>
          <label htmlFor="payment-method" className={labelBase}>
            Payment method
          </label>
          <select
            id="payment-method"
            className={inputBase}
            value={props.paymentMethod}
            onChange={(e) => props.setPaymentMethod(e.target.value)}
          >
            <option value="credit-card">Credit card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        {/* Shipping method */}
        <div>
          <label htmlFor="shipping-method" className={labelBase}>
            Shipping method
          </label>
          <select
            id="shipping-method"
            className={inputBase}
            value={props.shippingMethod}
            onChange={(e) => props.setShippingMethod(e.target.value)}
          >
            <option value="standard">Standard shipping</option>
            <option value="express">Express shipping</option>
          </select>
        </div>

        {/* Card details - only when credit card selected */}
        {props.paymentMethod === "credit-card" && (
          <div className="grid gap-4 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-900/80">
            <p className="text-sm font-medium text-foreground">Card details</p>
            <div>
              <label htmlFor="card-number" className={labelBase}>
                Card number
              </label>
              <input
                id="card-number"
                type="text"
                className={inputBase}
                value={props.cardNumber}
                onChange={(e) => props.setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                autoComplete="cc-number"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="card-expiry" className={labelBase}>
                  Expiration date
                </label>
                <input
                  id="card-expiry"
                  type="text"
                  className={inputBase}
                  value={props.expirationDate}
                  onChange={(e) => props.setExpirationDate(e.target.value)}
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                />
              </div>
              <div>
                <label htmlFor="card-cvv" className={labelBase}>
                  CVV
                </label>
                <input
                  id="card-cvv"
                  type="text"
                  className={inputBase}
                  value={props.cvv}
                  onChange={(e) => props.setCvv(e.target.value)}
                  placeholder="123"
                  autoComplete="cc-csc"
                />
              </div>
            </div>
          </div>
        )}

        {/* Billing address */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-900/80">
          <label className="flex cursor-pointer items-center gap-3 mb-4">
            <input
              type="checkbox"
              checked={props.billingSameAsShipping}
              onChange={(e) => props.setBillingSameAsShipping(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-600 text-midnight dark:text-tahiti focus:ring-midnight/30 dark:focus:ring-tahiti/40"
            />
            <span className="text-sm font-medium text-foreground">
              Billing address same as shipping
            </span>
          </label>

          {!props.billingSameAsShipping && (
            <div className="grid gap-4 pt-2 border-t border-neutral-200 dark:border-neutral-700">
              <div>
                <label htmlFor="billing-address" className={labelBase}>
                  Billing address
                </label>
                <input
                  id="billing-address"
                  type="text"
                  className={inputBase}
                  value={props.billingAddress}
                  onChange={(e) => props.setBillingAddress(e.target.value)}
                  placeholder="Street address"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="billing-city" className={labelBase}>
                    City
                  </label>
                  <input
                    id="billing-city"
                    type="text"
                    className={inputBase}
                    value={props.billingCity}
                    onChange={(e) => props.setBillingCity(e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label htmlFor="billing-state" className={labelBase}>
                    State
                  </label>
                  <input
                    id="billing-state"
                    type="text"
                    className={inputBase}
                    value={props.billingState}
                    onChange={(e) => props.setBillingState(e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div>
                  <label htmlFor="billing-zip" className={labelBase}>
                    ZIP code
                  </label>
                  <input
                    id="billing-zip"
                    type="text"
                    className={inputBase}
                    value={props.billingZipCode}
                    onChange={(e) => props.setBillingZipCode(e.target.value)}
                    placeholder="ZIP"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="billing-country" className={labelBase}>
                  Country
                </label>
                <input
                  id="billing-country"
                  type="text"
                  className={inputBase}
                  value={props.billingCountry}
                  onChange={(e) => props.setBillingCountry(e.target.value)}
                  placeholder="Country"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
