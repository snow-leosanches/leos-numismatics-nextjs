export interface PaymentInformationProps {
  setCardNumber: (cardNumber: string) => void;
  setExpirationDate: (expirationDate: string) => void;
  setCvv: (cvv: string) => void;
  setBillingAddress: (billingAddress: string) => void;
  setBillingCity: (billingCity: string) => void;
  setBillingState: (billingState: string) => void;
  setBillingZipCode: (billingZipCode: string) => void;
  setBillingCountry: (billingCountry: string) => void;
  setBillingSameAsShipping: (billingSameAsShipping: boolean) => void;
  setPaymentMethod: (paymentMethod: string) => void;
  setShippingMethod: (shippingMethod: string) => void;
}

export const PaymentInformation: React.FC<PaymentInformationProps> = (props) => {
  return <>
    <h1 className="text-xl">Payment Information</h1>
    <div className="grid gap-4">
      <label className="flex flex-col">
        <span>Payment Method</span>
        <select className="border border-gray-300 rounded p-2" onChange={(e) => props.setPaymentMethod(e.target.value)}>
          <option value="credit-card">Credit Card</option>
          <option value="paypal">PayPal</option>
        </select>
      </label>

      <label className="flex flex-col">
        <span>Shipping Method</span>
        <select className="border border-gray-300 rounded p-2" onChange={(e) => props.setShippingMethod(e.target.value)}>
          <option value="standard">Standard Shipping</option>
          <option value="express">Express Shipping</option>
        </select>
      </label>

      <label className="flex flex-col">
        <span>Card Number</span>
        <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => props.setCardNumber(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Expiration Date</span>
        <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => props.setExpirationDate(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>CVV</span>
        <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => props.setCvv(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Billing Address</span>
        <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => props.setBillingAddress(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Billing City</span>
        <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => props.setBillingCity(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Billing State</span>
        <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => props.setBillingState(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Billing Zip Code</span>
        <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => props.setBillingZipCode(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Billing Country</span>
        <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => props.setBillingCountry(e.target.value)} />
      </label>
    </div>
  </>
}