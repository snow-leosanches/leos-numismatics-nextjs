export interface ShippingInformationProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  customerAddress: string;
  setCustomerAddress: (address: string) => void;
  customerCity: string;
  setCustomerCity: (city: string) => void;
  customerState: string;
  setCustomerState: (state: string) => void;
  customerZipCode: string;
  setCustomerZipCode: (zipCode: string) => void;
  customerCountry: string;
  setCustomerCountry: (country: string) => void;
}

const inputBase =
  "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-foreground px-3 py-2.5 text-sm transition-colors placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-midnight/30 dark:focus:ring-tahiti/40 focus:border-midnight dark:focus:border-tahiti";

const labelBase = "text-sm font-medium text-foreground mb-1.5 block";

export const ShippingInformation: React.FC<ShippingInformationProps> = (props) => {
  return (
    <section
      className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 p-6 shadow-sm"
      aria-labelledby="shipping-heading"
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-midnight/10 dark:bg-tahiti/20 text-midnight dark:text-tahiti text-sm font-semibold" aria-hidden>
          1
        </span>
        <h2 id="shipping-heading" className="text-xl font-semibold text-foreground">
          Shipping information
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-1">
        <div>
          <label htmlFor="shipping-name" className={labelBase}>
            Full name
          </label>
          <input
            id="shipping-name"
            type="text"
            className={inputBase}
            value={props.customerName}
            onChange={(e) => props.setCustomerName(e.target.value)}
            placeholder="John Smith"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="shipping-address" className={labelBase}>
            Street address
          </label>
          <input
            id="shipping-address"
            type="text"
            className={inputBase}
            value={props.customerAddress}
            onChange={(e) => props.setCustomerAddress(e.target.value)}
            placeholder="123 Main St"
            autoComplete="street-address"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="shipping-city" className={labelBase}>
              City
            </label>
            <input
              id="shipping-city"
              type="text"
              className={inputBase}
              value={props.customerCity}
              onChange={(e) => props.setCustomerCity(e.target.value)}
              placeholder="City"
              autoComplete="address-level2"
            />
          </div>
          <div>
            <label htmlFor="shipping-state" className={labelBase}>
              State / Province
            </label>
            <input
              id="shipping-state"
              type="text"
              className={inputBase}
              value={props.customerState}
              onChange={(e) => props.setCustomerState(e.target.value)}
              placeholder="State"
              autoComplete="address-level1"
            />
          </div>
          <div>
            <label htmlFor="shipping-zip" className={labelBase}>
              ZIP / Postal code
            </label>
            <input
              id="shipping-zip"
              type="text"
              className={inputBase}
              value={props.customerZipCode}
              onChange={(e) => props.setCustomerZipCode(e.target.value)}
              placeholder="ZIP"
              autoComplete="postal-code"
            />
          </div>
        </div>

        <div>
          <label htmlFor="shipping-country" className={labelBase}>
            Country
          </label>
          <input
            id="shipping-country"
            type="text"
            className={inputBase}
            value={props.customerCountry}
            onChange={(e) => props.setCustomerCountry(e.target.value)}
            placeholder="Country"
            autoComplete="country-name"
          />
        </div>
      </div>
    </section>
  );
};
