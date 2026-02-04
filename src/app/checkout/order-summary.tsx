import Image from "next/image";
import { useStore } from "@/store";

export const OrderSummary: React.FC = () => {
    const store = useStore();

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
    
    return <aside className="lg:sticky lg:top-8 h-fit lg:row-span-2 lg:row-start-1 lg:col-start-2">
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
}
