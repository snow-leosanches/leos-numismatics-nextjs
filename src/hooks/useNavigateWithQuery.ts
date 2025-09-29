import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Custom hook to navigate while preserving query parameters
 * @returns Object with navigation functions
 */
export function useNavigateWithQuery() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Navigate to a new path while preserving current query parameters
   * @param newPathname - The path to navigate to
   * @param additionalParams - Optional additional query parameters to merge
   * @param replaceParams - If true, replace all params instead of merging (default: false)
   */
  const navigateWithQuery = useCallback(
    (
      newPathname: string,
      additionalParams?: Record<string, string>,
      replaceParams: boolean = false
    ) => {
      const currentQueryParams = replaceParams
        ? new URLSearchParams()
        : new URLSearchParams(searchParams.toString());

      // Add or override with additional params if provided
      if (additionalParams) {
        Object.entries(additionalParams).forEach(([key, value]) => {
          currentQueryParams.set(key, value);
        });
      }

      const queryString = currentQueryParams.toString();
      const newUrl = queryString ? `${newPathname}?${queryString}` : newPathname;
      
      router.push(newUrl);
    },
    [router, searchParams]
  );

  /**
   * Replace current route while preserving query parameters
   * @param newPathname - The path to navigate to
   * @param additionalParams - Optional additional query parameters to merge
   */
  const replaceWithQuery = useCallback(
    (newPathname: string, additionalParams?: Record<string, string>) => {
      const currentQueryParams = new URLSearchParams(searchParams.toString());

      if (additionalParams) {
        Object.entries(additionalParams).forEach(([key, value]) => {
          currentQueryParams.set(key, value);
        });
      }

      const queryString = currentQueryParams.toString();
      const newUrl = queryString ? `${newPathname}?${queryString}` : newPathname;
      
      router.replace(newUrl);
    },
    [router, searchParams]
  );

  return {
    navigateWithQuery,
    replaceWithQuery,
  };
}

// Usage example:
// import { useNavigateWithQuery } from '@/hooks/useNavigateWithQuery';
//
// function MyComponent() {
//   const { navigateWithQuery, replaceWithQuery } = useNavigateWithQuery();
//
//   return (
//     <div>
//       <button onClick={() => navigateWithQuery('/new-page')}>
//         Go to New Page (Preserve Query)
//       </button>
//       
//       <button onClick={() => navigateWithQuery('/products', { filter: 'electronics' })}>
//         Go to Products (Add Filter)
//       </button>
//       
//       <button onClick={() => navigateWithQuery('/search', { q: 'test' }, true)}>
//         Search (Replace All Params)
//       </button>
//     </div>
//   );
// }