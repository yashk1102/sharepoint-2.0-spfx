import * as React from 'react';
import { ICustomer } from '../components/types';
import { fetchGridItems } from '../services/SharePointService';
import { mapGridItemsToCustomers } from '../mappers/customerMapper';

const MAX_RESULTS = 8;

/**
 * Lightweight hook for the Navigation search dropdown.
 * Lazily loads customer data on first non-empty query, then filters client-side.
 * Uses "contains anywhere" matching across name, customerType, phone, email.
 */
export function useSearchCustomers(query: string): {
  results: ICustomer[];
  loading: boolean;
} {
  const [allCustomers, setAllCustomers] = React.useState<ICustomer[]>([]);
  const [loading, setLoading] = React.useState(false);
  const loadedRef = React.useRef(false);

  // Lazy-load customer data on first non-empty query
  React.useEffect(() => {
    if (!query || loadedRef.current) return;

    let cancelled = false;
    setLoading(true);

    fetchGridItems()
      .then(items => {
        if (!cancelled) {
          setAllCustomers(mapGridItemsToCustomers(items));
          loadedRef.current = true;
        }
      })
      .catch(() => {
        // Silently fail — dropdown just won't show results
      })
      .then(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [query]);

  // Filter client-side
  const results = React.useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (!q || allCustomers.length === 0) return [];

    const matches: ICustomer[] = [];
    for (const c of allCustomers) {
      if (
        c.name.toLowerCase().includes(q) ||
        c.customerType.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      ) {
        matches.push(c);
        if (matches.length >= MAX_RESULTS) break;
      }
    }
    return matches;
  }, [query, allCustomers]);

  return { results, loading };
}
