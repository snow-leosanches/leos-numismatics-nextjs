"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { observer } from "mobx-react-lite";

import { trackPageView } from "@snowplow/browser-tracker";
import { trackProductListView } from "@snowplow/browser-plugin-snowplow-ecommerce";

// import { useSnowplow } from "@/hooks/useSnowplow";
import { useNavigateWithQuery } from "@/hooks/useNavigateWithQuery";
import { BanknoteRow } from "./banknote-row";
import { Banknote, banknotes } from "./catalog";

export const dynamic = 'force-dynamic';

type ColumnsPerRow = 1 | 2 | 3;

const gridClassByColumns: Record<ColumnsPerRow, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
};

function parseColsParam(value: string | null): ColumnsPerRow {
  if (value === null) return 3;
  const n = parseInt(value, 10);
  if (n === 1 || n === 2 || n === 3) return n;
  return 3;
}

const Banknotes = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replaceWithQuery } = useNavigateWithQuery();

  const columnsPerRow = useMemo(
    () => parseColsParam(searchParams.get("cols")),
    [searchParams]
  );

  const setColumnsPerRow = (n: ColumnsPerRow) => {
    replaceWithQuery(pathname, { cols: String(n) });
  };

  // Approach 2: using `trackPageView` directly.
  useEffect(() => {
    trackPageView();
    trackProductListView({
      name: 'Banknotes Index',
      products: banknotes.map((banknote) => ({
        id: banknote.id,
        name: banknote.title,
        price: banknote.price,
        currency: 'USD',
        category: 'Banknotes'
      }))
    });
  }, []);

  return (
    <main className="container max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12">
      <header className="flex flex-col gap-4 pb-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Catalog
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Our Banknotes
          </h1>
          <div className="h-px w-12 bg-midnight dark:bg-tahiti rounded-full mt-1" aria-hidden />
        </div>

        <div className="flex items-center gap-2" role="group" aria-label="Banknotes per row">
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mr-1">
            Bankotes per row:
          </span>
          {([1, 2, 3] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setColumnsPerRow(n)}
              aria-pressed={columnsPerRow === n}
              aria-label={`${n} banknote${n > 1 ? "s" : ""} per row`}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                n > 1 ? "hidden md:inline-flex" : ""
              } ${
                columnsPerRow === n
                  ? "border-foreground bg-foreground text-background"
                  : "border-neutral-300 dark:border-neutral-600 bg-transparent text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </header>

      <div className={`grid gap-6 ${gridClassByColumns[columnsPerRow]}`}>
        {banknotes.map((banknote: Banknote) => (
          <BanknoteRow
            id={banknote.id}
            key={banknote.id}
            imageUrl={banknote.imageUrl}
            title={banknote.title}
            description={banknote.description}
            price={banknote.price}
          />
        ))}
      </div>
    </main>
  );
}

export default observer(Banknotes);