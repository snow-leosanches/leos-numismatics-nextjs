"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { observer } from "mobx-react-lite";
import { trackSiteSearch } from "@snowplow/browser-plugin-site-tracking";

import { useNavigateWithQuery } from "@/hooks/useNavigateWithQuery";
import { banknotes, Banknote } from "../banknotes/catalog";
import { BanknoteRow } from "../banknotes/banknote-row";
import { Intervention, subscribeToInterventions } from "@snowplow/signals-browser-plugin";
import { addInterventionHandlers } from "@snowplow/signals-browser-plugin";
import { snowplowTracker } from "@/components/snowplow-tracker";

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

  const [customerAttributes, setCustomerAttributes] = useState<Record<string, unknown>>({});

  // Shown when leos_numismatics_repeated_searches intervention triggers (mock AI agent)
  const [showRepeatedSearchesAgent, setShowRepeatedSearchesAgent] = useState(false);
  const [agentReply, setAgentReply] = useState("");
  const [agentConversation, setAgentConversation] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [agentTyping, setAgentTyping] = useState<{ words: string[]; index: number } | null>(null);

  const AGENT_SUGGESTIONS = useMemo(
    () => [
      {
        question: "Show me banknotes from Zimbabwe",
        response:
          'Great choice! We have several Zimbabwean banknotes, including the famous trillion-dollar series from the hyperinflation period. Try searching for "Zimbabwe" to see them.',
      },
      {
        question: "I'm interested in hyperinflation",
        response:
          "Hyperinflation notes are a fascinating niche. We have pieces from Zimbabwe, Venezuela, Hungary, and Yugoslavia. Search \"hyperinflation\" or pick a country to narrow it down.",
      },
      {
        question: "What do you have from Venezuela?",
        response:
          'We stock Venezuelan banknotes including the Carabobo and Maracaibo series. Search "Venezuela" or "bolivares" to browse.',
      },
    ],
    []
  );

  const TYPEWRITER_WORD_DELAY_MS = 80;

  // Typewriter: advance one word at a time until the full response is shown
  useEffect(() => {
    if (!agentTyping) return;
    const { words, index } = agentTyping;
    if (index >= words.length) {
      const fullText = words.join(" ");
      setAgentConversation((prev) => [...prev, { role: "assistant", text: fullText }]);
      setAgentTyping(null);
      return;
    }
    const t = setTimeout(() => {
      setAgentTyping((prev) => prev ? { ...prev, index: prev.index + 1 } : null);
    }, TYPEWRITER_WORD_DELAY_MS);
    return () => clearTimeout(t);
  }, [agentTyping]);

  // Fetch user attributes from Snowplow Signals Profile Store (on page load and when search is performed)
  // Returns true if the fetch was started (session ID available), false otherwise (caller may retry)
  const fetchCustomerAttributes = useCallback((): boolean => {
    if (!snowplowTracker) return false;
    const domainUserInfo = snowplowTracker.getDomainUserInfo();
    const domainSessionId = domainUserInfo?.[6]; // sessionId is at index 6
    if (!domainSessionId) return false;
    const params = new URLSearchParams({
      attribute_key: "domain_sessionid",
      identifier: domainSessionId,
      name: "leos_numismatics_session_id_attribute_service",
    });
    fetch(`/api/service-attributes?${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch service attributes: ${res.statusText}`);
        }
        return res.json();
      })
      .then((attributes) => {
        setCustomerAttributes(typeof attributes === "object" && attributes !== null ? attributes : {});
      })
      .catch((error) => {
        console.error("Failed to get service attributes:", error);
      });
    return true;
  }, []);

  // Fetch user attributes on page load and when navigating to/back to search; retry if session ID not ready yet
  const FETCH_ATTRIBUTES_RETRY_DELAY_MS = 500;
  const FETCH_ATTRIBUTES_MAX_RETRIES = 5;

  useEffect(() => {
    let retries = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const tryFetch = () => {
      const started = fetchCustomerAttributes();
      if (!started && retries < FETCH_ATTRIBUTES_MAX_RETRIES) {
        retries += 1;
        timeoutId = setTimeout(tryFetch, FETCH_ATTRIBUTES_RETRY_DELAY_MS);
      }
    };

    tryFetch();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [pathname, fetchCustomerAttributes]);

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

    // Refetch user attributes when a search is performed
    fetchCustomerAttributes();
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

  useEffect(() => {
    addInterventionHandlers({
      handler: (intervention: Intervention) => {
        switch (intervention.name) {
          case 'leos_numismatics_repeated_searches':
            setAgentConversation([]);
            setAgentTyping(null);
            setShowRepeatedSearchesAgent(true);
            break;
          default:
            console.log('intervention received!', intervention);
            break;
        }
      },
    });

    // Subscribe to interventions
    // Get endpoint from environment variable or use default (public, safe to expose)
    const signalsEndpoint = String(
      process.env.NEXT_PUBLIC_SNOWPLOW_SIGNALS_ENDPOINT ||
      '00000000-0000-0000-0000-000000000000.svc.snplow.net'
    )

    // console.log('userId before subscribing to interventions:', userId)
    subscribeToInterventions({
      endpoint: signalsEndpoint,
      /* attributeKeyIds: {
        user_id: userId || '',
      }, */
    })
  }, [])

  return (
    <main className="container max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12">
      <header className="flex flex-col gap-2 pb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Search Banknotes
        </h1>
        <div className="h-px w-12 bg-midnight dark:bg-tahiti rounded-full" aria-hidden />
      </header>

      {/* Mock AI agent chatbot – bottom-right, shown when repeated_searches intervention triggers */}
      {showRepeatedSearchesAgent && (
        <aside
          className="fixed bottom-6 right-6 z-50 w-[min(100vw-2rem,380px)] animate-in fade-in slide-in-from-bottom-4 duration-200 rounded-2xl border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-gray-900 shadow-xl shadow-amber-900/10 dark:shadow-black/40 overflow-hidden"
          aria-label="Search assistant"
        >
          {/* Chatbot header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-amber-100 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-200 dark:bg-amber-800/60 text-amber-800 dark:text-amber-200" aria-hidden>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Search assistant</p>
              <p className="text-xs text-amber-600 dark:text-amber-400/90">Here to help</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowRepeatedSearchesAgent(false);
                setAgentReply("");
                setAgentConversation([]);
                setAgentTyping(null);
              }}
              className="rounded-full p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-200/60 dark:hover:bg-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Close assistant"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Messages + suggestions */}
          <div className="px-4 py-3 space-y-3 max-h-[40vh] overflow-y-auto">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              I notice you’ve been searching a few times. What are you looking for—<strong>specific banknotes</strong>, <strong>countries</strong>, or <strong>topics</strong> like hyperinflation or historical currency?
            </p>
            {agentConversation.length === 0 && !agentTyping && (
              <div className="flex flex-col gap-2 pt-1">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {AGENT_SUGGESTIONS.map((s) => (
                    <button
                      key={s.question}
                      type="button"
                      onClick={() => {
                        setAgentConversation((prev) => [...prev, { role: "user", text: s.question }]);
                        setAgentTyping({ words: s.response.split(/\s+/), index: 0 });
                      }}
                      className="rounded-full border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 text-left text-sm text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-900/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      {s.question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {agentConversation.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-amber-600 text-white rounded-br-md"
                      : "bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 rounded-bl-md"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {agentTyping && (
              <div className="flex justify-start">
                <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-amber-100 dark:bg-amber-900/40 px-3 py-2 text-sm text-amber-900 dark:text-amber-100">
                  {agentTyping.words.slice(0, agentTyping.index).join(" ")}
                  <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-amber-600 dark:bg-amber-400" aria-hidden />
                </div>
              </div>
            )}
          </div>
          {/* Input area */}
          <div className="px-4 pb-4 pt-1 border-t border-amber-100 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20">
            <input
              type="text"
              value={agentReply}
              onChange={(e) => setAgentReply(e.target.value)}
              placeholder="e.g. Zimbabwe, Venezuela, hyperinflation..."
              className="w-full rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-foreground placeholder:text-amber-600/70 dark:placeholder:text-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-600 mb-3"
              aria-label="Your interests"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const newQuery = agentReply.trim();
                  if (newQuery) {
                    setQuery(newQuery);
                    setActiveQuery(newQuery);
                    const params = new URLSearchParams(searchParams.toString());
                    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
                    utmParams.forEach(param => {
                      const value = searchParams.get(param);
                      if (value) params.set(param, value);
                    });
                    params.set('q', newQuery);
                    const queryString = params.toString();
                    window.history.pushState({}, '', queryString ? `${pathname}?${queryString}` : pathname);
                    fetchCustomerAttributes();
                  }
                  setShowRepeatedSearchesAgent(false);
                  setAgentReply("");
                  setAgentConversation([]);
                  setAgentTyping(null);
                }}
                className="flex-1 rounded-xl border border-transparent bg-amber-600 py-2.5 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Apply to search
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRepeatedSearchesAgent(false);
                  setAgentReply("");
                  setAgentConversation([]);
                  setAgentTyping(null);
                }}
                className="rounded-xl border border-amber-400 dark:border-amber-600 px-4 py-2.5 text-sm font-medium text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                Dismiss
              </button>
            </div>
          </div>
        </aside>
      )}

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