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

export const PaymentInformation: React.FC<PaymentInformationProps> = (props) => {
  return <>
    <h1 className="text-xl">Payment Information</h1>
    <div className="grid gap-4">
      <label className="flex flex-col">
        <span>Payment Method</span>
        <select className="border border-gray-300 rounded p-2" value={props.paymentMethod} onChange={(e) => props.setPaymentMethod(e.target.value)}>
          <option value="credit-card">Credit Card</option>
          <option value="paypal">PayPal</option>
        </select>
      </label>

      <label className="flex flex-col">
        <span>Shipping Method</span>
        <select className="border border-gray-300 rounded p-2" value={props.shippingMethod} onChange={(e) => props.setShippingMethod(e.target.value)}>
          <option value="standard">Standard Shipping</option>
          <option value="express">Express Shipping</option>
        </select>
      </label>

      <label className="flex flex-col">
        <span>Card Number</span>
        <input type="text" className="border border-gray-300 rounded p-2" value={props.cardNumber} onChange={(e) => props.setCardNumber(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Expiration Date</span>
        <input type="text" className="border border-gray-300 rounded p-2" value={props.expirationDate} onChange={(e) => props.setExpirationDate(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>CVV</span>
        <input type="text" className="border border-gray-300 rounded p-2" value={props.cvv} onChange={(e) => props.setCvv(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Billing Address</span>
        <input type="text" className="border border-gray-300 rounded p-2" value={props.billingAddress} onChange={(e) => props.setBillingAddress(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Billing City</span>
        <input type="text" className="border border-gray-300 rounded p-2" value={props.billingCity} onChange={(e) => props.setBillingCity(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Billing State</span>
        <input type="text" className="border border-gray-300 rounded p-2" value={props.billingState} onChange={(e) => props.setBillingState(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Billing Zip Code</span>
        <input type="text" className="border border-gray-300 rounded p-2" value={props.billingZipCode} onChange={(e) => props.setBillingZipCode(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Billing Country</span>
        <input type="text" className="border border-gray-300 rounded p-2" value={props.billingCountry} onChange={(e) => props.setBillingCountry(e.target.value)} />
      </label>
    </div>
  </>
}