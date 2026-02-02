# Leo's Numismatics in Next.js

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), demonstrating Snowplow's capabilities.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Voucher codes (how to try it)

At checkout you can optionally apply a voucher code. The code prefix determines the type of discount:

- **`ITEM_SAVE`** (or any code starting with **`ITEM`**): one random product in your cart gets a **5–20%** discount.
- **`CART_10`** (or any code starting with **`CART`**): the **entire cart** gets a **5–20%** discount.
- **`FREE_GIFT`** (or any code starting with **`FREE`**): one **random free item** from the catalog is added to your cart (price $0).

The applied voucher is stored with the cart and survives page refresh (the discounted total is shown on the cart page too).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
