// ============================================================
// useProtocolBook — React hook for Protocol Book data
// ============================================================
import * as React from 'react';
import { ICustomer } from '../components/mockData';
import { fetchGridItems, fetchDetailItem } from '../services/SharePointService';
import { mapGridItemsToCustomers, mapDetailItemToCustomer } from '../mappers/customerMapper';

export interface IUseProtocolBookResult {
  /** Lightweight customer list for the card grid. */
  customers: ICustomer[];
  /** Fully-hydrated customer for the detail view (null until loaded). */
  customerDetail: ICustomer | null;
  /** True while the grid is loading. */
  gridLoading: boolean;
  /** True while a detail item is loading. */
  detailLoading: boolean;
  /** Error message (grid or detail). */
  error: string | null;
  /** Fetch full detail for one customer by numeric SP Id. */
  loadCustomerDetail: (id: number) => Promise<void>;
  /** Clear the currently loaded detail (e.g., when navigating back to grid). */
  clearDetail: () => void;
}

/**
 * Hook that encapsulates all data fetching for the Contact Cards web part.
 *
 * Usage:
 * ```tsx
 * const { customers, customerDetail, gridLoading, detailLoading, error, loadCustomerDetail, clearDetail } = useProtocolBook();
 * ```
 */
export function useProtocolBook(): IUseProtocolBookResult {
  const [customers, setCustomers] = React.useState<ICustomer[]>([]);
  const [customerDetail, setCustomerDetail] = React.useState<ICustomer | null>(null);
  const [gridLoading, setGridLoading] = React.useState(true);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Track mounted state to avoid setState after unmount
  const mountedRef = React.useRef(true);
  React.useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  // ---- Load grid data on mount ----
  React.useEffect(() => {
    let cancelled = false;

    async function loadGrid(): Promise<void> {
      try {
        setGridLoading(true);
        setError(null);
        const items = await fetchGridItems();
        if (!cancelled && mountedRef.current) {
          setCustomers(mapGridItemsToCustomers(items));
        }
      } catch (err) {
        console.error('[useProtocolBook] Grid fetch failed:', err);
        if (!cancelled && mountedRef.current) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load customer list. Please try again.'
          );
        }
      } finally {
        if (!cancelled && mountedRef.current) {
          setGridLoading(false);
        }
      }
    }

    loadGrid().catch(() => { /* swallowed — handled inside */ });

    return () => { cancelled = true; };
  }, []);

  // ---- Load detail for a single customer ----
  const loadCustomerDetail = React.useCallback(async (id: number): Promise<void> => {
    try {
      setDetailLoading(true);
      setError(null);
      const item = await fetchDetailItem(id);
      if (mountedRef.current) {
        setCustomerDetail(mapDetailItemToCustomer(item));
      }
    } catch (err) {
      console.error('[useProtocolBook] Detail fetch failed:', err);
      if (mountedRef.current) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load customer details. Please try again.'
        );
      }
    } finally {
      if (mountedRef.current) {
        setDetailLoading(false);
      }
    }
  }, []);

  // ---- Clear detail (back to grid) ----
  const clearDetail = React.useCallback(() => {
    setCustomerDetail(null);
    setError(null);
  }, []);

  return {
    customers,
    customerDetail,
    gridLoading,
    detailLoading,
    error,
    loadCustomerDetail,
    clearDetail,
  };
}
