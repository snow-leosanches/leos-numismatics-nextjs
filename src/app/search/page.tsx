import { Suspense } from "react";
import { SearchContent } from "./search-content";

export const dynamic = 'force-dynamic';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="container grid justify-center pt-8 px-4">
        <div className="col gap-4 pb-8">
          <h1 className="text-2xl">Search Banknotes</h1>
        </div>
        <div className="grid gap-4">
          <p>Loading...</p>
        </div>
      </main>
    }>
      <SearchContent />
    </Suspense>
  );
}