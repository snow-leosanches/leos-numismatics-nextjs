export interface ShippingInformationProps {
  setCustomerName: (name: string) => void;
  setCustomerAddress: (address: string) => void;
  setCustomerCity: (city: string) => void;
  setCustomerState: (state: string) => void;
  setCustomerZipCode: (zipCode: string) => void;
  setCustomerCountry: (country: string) => void;
}

export const ShippingInformation: React.FC<ShippingInformationProps> = (props) => {
  return <>
    <h1 className="text-xl">Shipping Information</h1>

    <div className="grid gap-4">
      <label className="flex flex-col">
        <span>Name</span>
        <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => props.setCustomerName(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Address</span>
        <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => props.setCustomerAddress(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>City</span>
        <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => props.setCustomerCity(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>State</span>
        <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => props.setCustomerState(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Zip Code</span>
        <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => props.setCustomerZipCode(e.target.value)} />
      </label>

      <label className="flex flex-col">
        <span>Country</span>
        <input type="text" className="border border-gray-300 rounded p-2" onChange={(e) => props.setCustomerCountry(e.target.value)} />
      </label>
    </div>
  </>
}