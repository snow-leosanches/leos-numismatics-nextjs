import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Hook to build hrefs that preserve or modify query parameters
 */
export function useBuildHref() {
  const searchParams = useSearchParams();

  /**
   * Build an href with query parameter preservation
   * @param path - The destination path
   * @param options - Configuration options
   */
  const buildHref = useCallback(
    (
      path: string,
      options?: {
        preserveQuery?: boolean;
        additionalParams?: Record<string, string>;
        replaceParams?: boolean;
      }
    ) => {
      const {
        preserveQuery = true,
        additionalParams,
        replaceParams = false,
      } = options || {};

      if (!preserveQuery && !additionalParams) {
        return path;
      }

      const currentParams = replaceParams || !preserveQuery
        ? new URLSearchParams()
        : new URLSearchParams(searchParams.toString());

      if (additionalParams) {
        Object.entries(additionalParams).forEach(([key, value]) => {
          currentParams.set(key, value);
        });
      }

      const queryString = currentParams.toString();
      return queryString ? `${path}?${queryString}` : path;
    },
    [searchParams]
  );

  return { buildHref };
}

// Usage example with standard Next.js Link:
//
// import Link from 'next/link';
// import { useBuildHref } from '@/hooks/useBuildHref';
//
// function MyComponent() {
//   const { buildHref } = useBuildHref();
//
//   return (
//     <div>
//       {/* Preserve all query params */}
//       <Link href={buildHref('/dashboard')}>Dashboard</Link>
//
//       {/* Add additional params */}
//       <Link href={buildHref('/products', { 
//         additionalParams: { category: 'books' } 
//       })}>
//         Products
//       </Link>
//
//       {/* Don't preserve query params */}
//       <Link href={buildHref('/login', { preserveQuery: false })}>
//         Login
//       </Link>
//
//       {/* Replace all params */}
//       <Link href={buildHref('/search', { 
//         additionalParams: { q: 'test' },
//         replaceParams: true 
//       })}>
//         Search
//       </Link>
//     </div>
//   );
// }