import { Suspense } from "react";
import { SearchContent } from "./search-content";

export const dynamic = 'force-dynamic';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="container max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12">
        <header className="flex flex-col gap-2 pb-10">
          <h1 className="text-3xl font-semibold tracking-tight">Search Banknotes</h1>
        </header>
        <p className="text-neutral-500">Loading...</p>
      </main>
    }>
      <SearchContent />
    </Suspense>
  );
}