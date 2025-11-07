"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import { trackSiteSearch } from "@snowplow/browser-plugin-site-tracking";

import { banknotes, Banknote } from "../banknotes/catalog";
import { BanknoteRow } from "../banknotes/banknote-row";

export const dynamic = 'force-dynamic';

// Helper function to extract country from title (e.g., "50 Dollars (Fiji)" -> "Fiji")
const extractCountry = (title: string): string | null => {
  const match = title.match(/\(([^)]+)\)/);
  return match ? match[1] : null;
};

// Get all unique countries from banknotes
const getUniqueCountries = (): string[] => {
  const countries = new Set<string>();
  banknotes.forEach(banknote => {
    const country = extractCountry(banknote.title);
    if (country) {
      countries.add(country);
    }
  });
  return Array.from(countries).sort();
};

const SearchContent = () => {
  const searchParams = useSearchParams();
  
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
        const banknoteCountry = extractCountry(banknote.title);
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
    const params = new URLSearchParams();
    
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
    }
    
    if (selectedCountry) {
      params.set('country', selectedCountry);
    }
    
    if (minPrice) {
      params.set('minPrice', minPrice);
    }
    
    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    }
    
    const newUrl = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
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
        const banknoteCountry = extractCountry(banknote.title);
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
      pageResults: results.length, // Assuming all results are shown on first page
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
    <main className="container grid justify-center pt-8 px-4">
      <div className="col gap-4 pb-8">
        <h1 className="text-2xl">Search Banknotes</h1>
      </div>

      <form onSubmit={handleSearch} className="grid gap-4 pb-8 w-full max-w-4xl">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="grid gap-4 w-full max-w-4xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl">
            {filteredBanknotes.length === 0
              ? 'No banknotes found'
              : `Found ${filteredBanknotes.length} banknote${filteredBanknotes.length !== 1 ? 's' : ''}`}
          </h2>
        </div>

        {filteredBanknotes.length > 0 ? (
          <div className="grid gap-4">
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
};

const Search = observer(SearchContent);

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
      <Search />
    </Suspense>
  );
}

