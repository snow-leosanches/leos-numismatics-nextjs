"use client";

import Link from "next/link";
import Image from "next/image";

import { useBuildHref } from "@/hooks/useBuildHref";

const footerLink =
  "text-sm text-neutral-600 dark:text-neutral-400 hover:text-foreground dark:hover:text-foreground transition-colors";

export const Footer: React.FunctionComponent = () => {
  const { buildHref } = useBuildHref();

  return (
    <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity">
              <Image
                src="/images/icon.png"
                alt=""
                width={32}
                height={32}
                className="rounded"
                aria-hidden
              />
              <span className="font-bold text-lg uppercase tracking-wider text-foreground">
                Leo&apos;s Numismatics
              </span>
            </Link>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-xs">
              Collectible banknotes from around the world.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
              Shop
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href={buildHref("/")} className={footerLink}>
                  Home
                </Link>
              </li>
              <li>
                <Link href={buildHref("/banknotes")} className={footerLink}>
                  Banknotes
                </Link>
              </li>
              <li>
                <Link href={buildHref("/search")} className={footerLink}>
                  Search
                </Link>
              </li>
              <li>
                <Link href={buildHref("/cart")} className={footerLink}>
                  Your Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
              Account
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/login" className={footerLink}>
                  Login
                </Link>
              </li>
              <li>
                <Link href="/account" className={footerLink}>
                  My Account
                </Link>
              </li>
              <li>
                <a href="#" className={footerLink}>
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} Leo&apos;s Numismatics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
