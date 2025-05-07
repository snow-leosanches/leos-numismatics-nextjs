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

export const ShippingInformation: React.FC<ShippingInformationProps> = (props) => {
  return <>
    <h1 className="text-xl">Shipping Information</h1>

    <div className="grid gap-4">
      <label className="flex flex-col">
        <span>Name</span>
        <input type="text" className="border border-gray-300 rounded p-2" value={props.customerName} onChange={(e) => props.setCustomerName(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Address</span>
        <input type="text" className="border border-gray-300 rounded p-2" value={props.customerAddress} onChange={(e) => props.setCustomerAddress(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>City</span>
        <input type="text" className="border border-gray-300 rounded p-2" value={props.customerCity} onChange={(e) => props.setCustomerCity(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>State</span>
        <input type="text" className="border border-gray-300 rounded p-2" value={props.customerState} onChange={(e) => props.setCustomerState(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Zip Code</span>
        <input type="text" className="border border-gray-300 rounded p-2" value={props.customerZipCode} onChange={(e) => props.setCustomerZipCode(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Country</span>
        <input type="text" className="border border-gray-300 rounded p-2" value={props.customerCountry} onChange={(e) => props.setCustomerCountry(e.target.value)} />
      </label>
    </div>
  </>
}