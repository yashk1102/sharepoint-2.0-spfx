import * as React from 'react';
import { ICustomer } from '../components/types';
import { fetchGridItems, fetchDetailItem } from '../services/SharePointService';
import { mapGridItemsToCustomers, mapDetailItemToCustomer } from '../mappers/customerMapper';

export interface IUseProtocolBookResult {
  customers: ICustomer[];
  customerDetail: ICustomer | null;
  gridLoading: boolean;
  detailLoading: boolean;
  error: string | null;
  loadCustomerDetail: (id: number) => Promise<void>;
  clearDetail: () => void;
}

/** Handles all data fetching for the Contact Cards web part. */
export function useProtocolBook(): IUseProtocolBookResult {
  const [customers, setCustomers] = React.useState<ICustomer[]>([]);
  const [customerDetail, setCustomerDetail] = React.useState<ICustomer | null>(null);
  const [gridLoading, setGridLoading] = React.useState(true);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const mountedRef = React.useRef(true);
  React.useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

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

    loadGrid().catch(() => {});

    return () => { cancelled = true; };
  }, []);

  const loadCustomerDetail = React.useCallback(async (id: number): Promise<void> => {
    try {
      setDetailLoading(true);
      setError(null);
      const item = await fetchDetailItem(id);
      if (mountedRef.current) {
        setCustomerDetail(mapDetailItemToCustomer(item));
      }
    } catch (err) {
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
