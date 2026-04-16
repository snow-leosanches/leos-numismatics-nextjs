"use client";

import { observer } from "mobx-react-lite";
import { useStore } from "@/store";

const PurchaseHistoryPanel = () => {
  const store = useStore();
  const { orders } = store.orderHistory;

  return (
    <div className="grid gap-4">
      <h2 className="text-xl">Purchase History</h2>
      {orders.length === 0 ? (
        <p className="text-foreground/60">No purchases yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm font-mono text-foreground/60">#{order.id}</span>
                <span className="text-sm text-foreground/60">
                  {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {order.products.map((product) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span>{product.name} × {product.quantity}</span>
                    <span>{product.currency} {(product.price * product.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-2 flex flex-col gap-1 text-sm">
                <div className="flex justify-between text-foreground/60">
                  <span>Subtotal</span>
                  <span>USD {order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-foreground/60">
                    <span>Discount</span>
                    <span>-USD {order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-foreground/60">
                  <span>Shipping</span>
                  <span>USD {order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground/60">
                  <span>Tax</span>
                  <span>USD {order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>USD {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default observer(PurchaseHistoryPanel);
