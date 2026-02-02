"use client";

import { useState, useMemo } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { observer } from "mobx-react-lite";
import { trackSiteSearch } from "@snowplow/browser-plugin-site-tracking";

import { useNavigateWithQuery } from "@/hooks/useNavigateWithQuery";
import { banknotes, Banknote } from "../banknotes/catalog";
import { BanknoteRow } from "../banknotes/banknote-row";

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

// Get all unique countries from banknotes
const getUniqueCountries = (): string[] => {
  const countries = new Set<string>();
  banknotes.forEach(banknote => {
    countries.add(banknote.country);
  });
  return Array.from(countries).sort();
};

export const SearchContent = observer(() => {
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

  // Get initial values from URL params
  const initialQuery = searchParams.get('q') || '';
  const initialCountry = searchParams.get('country') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  // Active search criteria (only updated when Search button is clicked)
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [activeCountry, setActiveCountry] = useState(initialCountry);
  const [activeMinPrice, setActiveMinPrice] = useState(initialMinPrice);
  const [activeMaxPrice, setActiveMaxPrice] = useState(initialMaxPrice);

  const countries = getUniqueCountries();
  const maxPriceValue = Math.max(...banknotes.map(b => b.price));

  // Filter banknotes based on active search criteria (only updates when Search is clicked)
  const filteredBanknotes = useMemo(() => {
    return banknotes.filter(banknote => {
      // Text search in title and description
      if (activeQuery) {
        const searchLower = activeQuery.toLowerCase();
        const matchesTitle = banknote.title.toLowerCase().includes(searchLower);
        const matchesDescription = banknote.description.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) {
          return false;
        }
      }

      // Country filter
      if (activeCountry) {
        const banknoteCountry = banknote.country;
        if (banknoteCountry !== activeCountry) {
          return false;
        }
      }

      // Price range filter
      const price = banknote.price;
      if (activeMinPrice && price < parseFloat(activeMinPrice)) {
        return false;
      }
      if (activeMaxPrice && price > parseFloat(activeMaxPrice)) {
        return false;
      }

      return true;
    });
  }, [activeQuery, activeCountry, activeMinPrice, activeMaxPrice]);

  const updateURL = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Preserve UTM parameters from current URL
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    utmParams.forEach(param => {
      const value = searchParams.get(param);
      if (value) {
        params.set(param, value);
      }
    });
    
    // Add search parameters
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    
    if (selectedCountry) {
      params.set('country', selectedCountry);
    } else {
      params.delete('country');
    }
    
    if (minPrice) {
      params.set('minPrice', minPrice);
    } else {
      params.delete('minPrice');
    }
    
    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    } else {
      params.delete('maxPrice');
    }
    
    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;
    window.history.pushState({}, '', newUrl);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update active search criteria
    setActiveQuery(query);
    setActiveCountry(selectedCountry);
    setActiveMinPrice(minPrice);
    setActiveMaxPrice(maxPrice);
    
    // Update URL
    updateURL();
    
    // Track search event with Snowplow
    const searchTerms: string[] = [];
    if (query.trim()) {
      // Split query into individual terms
      searchTerms.push(...query.trim().split(/\s+/));
    }
    
    const filters: Record<string, string> = {};
    if (selectedCountry) {
      filters.country = selectedCountry;
    }
    if (minPrice) {
      filters.minPrice = minPrice;
    }
    if (maxPrice) {
      filters.maxPrice = maxPrice;
    }
    
    // Calculate results after filtering
    const results = banknotes.filter(banknote => {
      if (query.trim()) {
        const searchLower = query.trim().toLowerCase();
        const matchesTitle = banknote.title.toLowerCase().includes(searchLower);
        const matchesDescription = banknote.description.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) {
          return false;
        }
      }
      if (selectedCountry) {
        const banknoteCountry = banknote.country;
        if (banknoteCountry !== selectedCountry) {
          return false;
        }
      }
      const price = banknote.price;
      if (minPrice && price < parseFloat(minPrice)) {
        return false;
      }
      if (maxPrice && price > parseFloat(maxPrice)) {
        return false;
      }
      return true;
    });
    
    trackSiteSearch({
      terms: searchTerms.length > 0 ? searchTerms : [''],
      filters: Object.keys(filters).length > 0 ? filters : undefined,
      totalResults: results.length,
      pageResults: results.length,
    });
  };

  const handleReset = () => {
    setQuery('');
    setSelectedCountry('');
    setMinPrice('');
    setMaxPrice('');
    
    // Reset active search criteria
    setActiveQuery('');
    setActiveCountry('');
    setActiveMinPrice('');
    setActiveMaxPrice('');
    
    // Preserve UTM params when resetting
    const params = new URLSearchParams();
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    utmParams.forEach(param => {
      const value = searchParams.get(param);
      if (value) {
        params.set(param, value);
      }
    });
    
    const newUrl = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.pushState({}, '', newUrl);
  };

  return (
    <main className="container max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12">
      <header className="flex flex-col gap-2 pb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Search Banknotes
        </h1>
        <div className="h-px w-12 bg-midnight dark:bg-tahiti rounded-full" aria-hidden />
      </header>

      <form onSubmit={handleSearch} className="grid gap-6 pb-12 w-full">
        {/* Text Search */}
        <div className="flex flex-col gap-2">
          <label htmlFor="search" className="text-sm font-medium">
            Search by name or description
          </label>
          <input
            id="search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Zimbabwe, hyperinflation, trillion..."
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Country Filter */}
        <div className="flex flex-col gap-2">
          <label htmlFor="country" className="text-sm font-medium">
            Country
          </label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Countries</option>
            {countries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="minPrice" className="text-sm font-medium">
              Minimum Price ($)
            </label>
            <input
              id="minPrice"
              type="number"
              min="0"
              step="0.01"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0.00"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="maxPrice" className="text-sm font-medium">
              Maximum Price ($)
            </label>
            <input
              id="maxPrice"
              type="number"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder={`${maxPriceValue.toFixed(2)}`}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-solid border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center bg-white dark:bg-gray-800 text-foreground gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="grid gap-6 w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-xl">
            {filteredBanknotes.length === 0
              ? 'No banknotes found'
              : `Found ${filteredBanknotes.length} banknote${filteredBanknotes.length !== 1 ? 's' : ''}`}
          </h2>
          <div className="flex items-center gap-2" role="group" aria-label="Banknotes per row">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mr-1">
              Banknotes per row:
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
        </div>

        {filteredBanknotes.length > 0 ? (
          <div className={`grid gap-6 ${gridClassByColumns[columnsPerRow]}`}>
            {filteredBanknotes.map((banknote: Banknote) => (
              <BanknoteRow
                key={banknote.id}
                id={banknote.id}
                imageUrl={banknote.imageUrl}
                title={banknote.title}
                description={banknote.description}
                price={banknote.price}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Try adjusting your search criteria to find more results.</p>
          </div>
        )}
      </div>
    </main>
  );
});