export interface BanknoteInCartProps {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
  removeProduct: (productId: string, name: string, price: number, quantity: number) => void;
}

export const BanknoteInCart: React.FC<BanknoteInCartProps> = ({ id, imageUrl, name, price, quantity, removeProduct }) => {
  return (
    <div className="flex items-center gap-4 pb-4">
      <div className="flex flex-col gap-2">
        <img
          src={imageUrl}
          alt={name}
          width={180}
          height={120}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg">{name}</h2>
        <p className="text-sm text-gray-500">Price: ${price.toFixed(2)}</p>
        <p className="text-sm text-gray-500">Quantity: {quantity}</p>
      </div>
      <div className="flex gap-2">
        <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto" onClick={() => removeProduct(id, name, price, quantity)}>
          Remove
        </button>
      </div>
    </div>
  );
}
