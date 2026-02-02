/**
 * Voucher system: code prefix determines type.
 * - ITEM_* → random 5–20% off one product in cart
 * - CART_* → random 5–20% off entire cart
 * - FREE_* → one random free item from catalog (added to cart at $0)
 */

const MIN_PERCENT = 5;
const MAX_PERCENT = 20;

export const VOUCHER_PREFIXES = {
  ITEM: "ITEM",
  CART: "CART",
  FREE: "FREE",
} as const;

export type VoucherPrefix = (typeof VOUCHER_PREFIXES)[keyof typeof VOUCHER_PREFIXES];

function randomPercent(): number {
  return Math.floor(MIN_PERCENT + Math.random() * (MAX_PERCENT - MIN_PERCENT + 1));
}

export type VoucherResultItem = {
  type: "item";
  percent: number;
  productId: string;
};

export type VoucherResultCart = {
  type: "cart";
  percent: number;
};

export type VoucherResultFree = {
  type: "free";
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    imageUrl: string;
    quantity: number;
  };
  catalogPrice: number;
};

export type VoucherResultError = {
  type: "error";
  message: string;
};

export type VoucherResult =
  | VoucherResultItem
  | VoucherResultCart
  | VoucherResultFree
  | VoucherResultError;

/** Catalog item shape used when resolving free product (e.g. Banknote) */
export type CatalogItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
};

/** Cart line shape needed for voucher logic */
export type CartLine = {
  id: string;
  price: number;
  quantity: number;
};

/**
 * Applies a voucher code and returns the result.
 * - ITEM: random product from cart gets random 5–20% off
 * - CART: entire cart gets random 5–20% off
 * - FREE: random product from catalog is returned as free (price 0) to be added to cart
 */
export function applyVoucher(
  code: string,
  cartProducts: CartLine[],
  catalog: CatalogItem[]
): VoucherResult {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { type: "error", message: "Please enter a voucher code." };
  }

  if (normalized.startsWith(VOUCHER_PREFIXES.ITEM)) {
    if (cartProducts.length === 0) {
      return { type: "error", message: "Cart is empty. Add items before using this voucher." };
    }
    const index = Math.floor(Math.random() * cartProducts.length);
    const product = cartProducts[index];
    return {
      type: "item",
      percent: randomPercent(),
      productId: product.id,
    };
  }

  if (normalized.startsWith(VOUCHER_PREFIXES.CART)) {
    if (cartProducts.length === 0) {
      return { type: "error", message: "Cart is empty. Add items before using this voucher." };
    }
    return {
      type: "cart",
      percent: randomPercent(),
    };
  }

  if (normalized.startsWith(VOUCHER_PREFIXES.FREE)) {
    if (catalog.length === 0) {
      return { type: "error", message: "No products available for free item." };
    }
    const item = catalog[Math.floor(Math.random() * catalog.length)];
    return {
      type: "free",
      catalogPrice: item.price,
      product: {
        id: item.id,
        name: item.title,
        description: item.description,
        price: 0,
        currency: "USD",
        imageUrl: item.imageUrl,
        quantity: 1,
      },
    };
  }

  return { type: "error", message: "Invalid voucher code." };
}

/** Success voucher result (including stored free shape without full product). */
export type VoucherResultSuccess =
  | VoucherResultItem
  | VoucherResultCart
  | VoucherResultFree
  | { type: "free"; productId: string; catalogPrice: number };

/**
 * Computes discount amount in dollars from a successful voucher result and cart state.
 * Used for display and order total.
 */
export function getDiscountAmount(
  result: VoucherResultSuccess,
  subtotal: number,
  products: { id: string; price: number; quantity: number }[]
): number {
  switch (result.type) {
    case "item": {
      const line = products.find((p) => p.id === result.productId);
      if (!line) return 0;
      const lineTotal = line.price * line.quantity;
      return (lineTotal * result.percent) / 100;
    }
    case "cart":
      return (subtotal * result.percent) / 100;
    case "free":
      return result.catalogPrice;
    default:
      return 0;
  }
}
