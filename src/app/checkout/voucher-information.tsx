import React from "react";
import { observer } from "mobx-react-lite";
import { applyVoucher, type CatalogItem } from "@/components/voucher";
import { ProductEntity } from "@/store/entities";
import { useStore } from "@/store";
import type { StoredVoucherResult } from "@/store/cart";
import { trackVoucherAppliedSpec } from "../../../snowtype/snowplow";

export interface VoucherInformationProps {
  voucherEligible: boolean | null;
  voucherCodeInput: string;
  setVoucherCodeInput: (voucherCodeInput: string) => void;
  voucherError: string | null;
  setVoucherError: (voucherError: string | null) => void;
  catalogForVoucher: CatalogItem[];
}

const VoucherInformationInner: React.FC<VoucherInformationProps> = (props) => {
  const store = useStore();
  const { catalogForVoucher } = props;

  const voucherResult = store.cart.voucherResult;

  const handleApplyVoucher = () => {
    props.setVoucherError(null);
    const result = applyVoucher(
      props.voucherCodeInput,
      store.cart.products.map((p) => ({ id: p.id, price: p.price, quantity: p.quantity })),
      catalogForVoucher
    );
    if (result.type === "error") {
      props.setVoucherError(result.message);
      return;
    }
    const appliedCode = props.voucherCodeInput.trim().toUpperCase();

    if (result.type === "free") {
      store.cart.addProduct(
        new ProductEntity(
          result.product.id,
          result.product.name,
          result.product.description,
          result.product.price,
          result.product.currency,
          result.product.imageUrl,
          result.product.quantity
        )
      );
      store.cart.setAppliedVoucher(appliedCode, {
        type: "free",
        productId: result.product.id,
        catalogPrice: result.catalogPrice,
      });
    } else {
      store.cart.setAppliedVoucher(appliedCode, result);
    }

    const discountAmount =
      result.type === "item"
        ? (() => {
          const line = store.cart.products.find((p) => p.id === result.productId);
          return line ? (line.price * line.quantity * result.percent) / 100 : 0;
        })()
        : result.type === "cart"
          ? (store.cart.total * result.percent) / 100
          : result.catalogPrice;

    trackVoucherAppliedSpec({
      code: appliedCode,
      discount_amount: discountAmount,
      ...(result.type === "free" && { free_product_id: result.product.id }),
    });

    props.setVoucherCodeInput("");
  };

  const handleRemoveVoucher = () => {
    store.cart.removeVoucher();
    props.setVoucherError(null);
  };

  return <div
    className={
      props.voucherEligible === false
        ? "rounded-xl border-2 border-amber-300 dark:border-amber-600 bg-amber-50/80 dark:bg-amber-950/40 p-5 shadow-sm"
        : "rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 p-5 shadow-sm"
    }
  >
    <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
      Voucher
    </h2>
    {store.cart.appliedVoucherCode ? (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-foreground">
          Code <strong>{store.cart.appliedVoucherCode}</strong> applied.
          {voucherResult?.type === "item" && (
            <span className="text-neutral-500 dark:text-neutral-400"> Single item {voucherResult.percent}% off.</span>
          )}
          {voucherResult?.type === "cart" && (
            <span className="text-neutral-500 dark:text-neutral-400"> Cart {voucherResult.percent}% off.</span>
          )}
          {voucherResult?.type === "free" && (
            <span className="text-neutral-500 dark:text-neutral-400"> Free item added.</span>
          )}
        </span>
        <button
          type="button"
          onClick={handleRemoveVoucher}
          className="text-sm font-medium text-foreground underline hover:no-underline"
        >
          Remove
        </button>
      </div>
    ) : props.voucherEligible === false ? (
      <p className="text-sm font-medium text-amber-800 dark:text-amber-200" role="status">
        Vouchers are not available at this time.
      </p>
    ) : props.voucherEligible === true ? (
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={props.voucherCodeInput}
          onChange={(e) => props.setVoucherCodeInput(e.target.value)}
          placeholder="Enter code"
          className="flex-1 min-w-0 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-foreground placeholder:text-neutral-400"
          aria-label="Voucher code"
        />
        <button
          type="button"
          onClick={handleApplyVoucher}
          className="rounded-full border border-solid border-transparent bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          Apply
        </button>
      </div>
    ) : (
      <p className="text-sm text-neutral-500 dark:text-neutral-400">Checking voucher availability…</p>
    )}
    {props.voucherError && (
      <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
        {props.voucherError}
      </p>
    )}
  </div>;
};

export const VoucherInformation = observer(VoucherInformationInner);
