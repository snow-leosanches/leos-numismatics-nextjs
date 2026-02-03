export interface BanknoteInCartProps {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
  removeProduct: (productId: string, name: string, price: number, quantity: number) => void;
}

export const BanknoteInCart: React.FC<BanknoteInCartProps> = ({ id, imageUrl, name, price, quantity, removeProduct }) => {
  const lineTotal = price * quantity;

  return (
    <article
      className="flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900/50 shadow-sm"
      aria-label={`${name}, $${price.toFixed(2)} each, quantity ${quantity}`}
    >
      <div className="flex-shrink-0 w-full sm:w-36 aspect-[3/2] rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={imageUrl}
          alt={name}
          width={180}
          height={120}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <h2 className="text-base sm:text-lg font-semibold text-foreground leading-tight">
          {name}
        </h2>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
          <span>${price.toFixed(2)} each</span>
          <span aria-hidden>·</span>
          <span>Qty {quantity}</span>
        </div>
        <p className="text-sm font-medium text-foreground mt-auto">
          Line total: <span className="font-semibold">${lineTotal.toFixed(2)}</span>
        </p>
      </div>

      <div className="flex sm:flex-col sm:justify-between sm:items-end gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => removeProduct(id, name, price, quantity)}
          className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-3 py-2 text-sm font-medium text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors inline-flex items-center gap-1.5"
          aria-label={`Remove ${name} from cart`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
          Remove
        </button>
      </div>
    </article>
  );
}
