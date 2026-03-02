import * as React from 'react';
import styles from './CustomerContactCards.module.scss';
import { ICustomerContactCardsProps } from './ICustomerContactCardsProps';
import { ICustomer } from './mockData';
import CardGridView from './CardGridView';
import CustomerDetailView from './CustomerDetailView';
import { Navigation } from '../../rapidCityHomepage/components/Navigation/Navigation';
import { defaultTheme, getThemeCssVariables } from '../../rapidCityHomepage/theme/ThemeTokens';
import { useProtocolBook } from '../hooks/useProtocolBook';

type ViewState = 'grid' | 'detail';

const CustomerContactCards: React.FC<ICustomerContactCardsProps> = ({ title }) => {
  const [view, setView]                         = React.useState<ViewState>('grid');
  const [selectedCustomer, setSelectedCustomer] = React.useState<ICustomer | null>(null);
  const [searchQuery, setSearchQuery]           = React.useState('');

  const themeVars = React.useMemo(() => getThemeCssVariables(defaultTheme), []);

  // Live SharePoint data via hook
  const {
    customers,
    customerDetail,
    gridLoading,
    detailLoading,
    error,
    loadCustomerDetail,
    clearDetail,
  } = useProtocolBook();

  // When detail data arrives from the API, update the selected customer
  // with the fully-hydrated version (replaces the lightweight grid stub).
  React.useEffect(() => {
    if (customerDetail && view === 'detail') {
      setSelectedCustomer(customerDetail);
    }
  }, [customerDetail, view]);

  const handleCardClick = React.useCallback((customer: ICustomer): void => {
    // Show the lightweight customer immediately (header renders while detail loads)
    setSelectedCustomer(customer);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch full detail with expanded lookups
    const numericId = parseInt(customer.id, 10);
    if (!isNaN(numericId)) {
      loadCustomerDetail(numericId).catch(() => { /* error handled inside hook */ });
    }
  }, [loadCustomerDetail]);

  const handleBack = React.useCallback((): void => {
    setView('grid');
    setSelectedCustomer(null);
    clearDetail();
  }, [clearDetail]);

  const handleNavSearch = React.useCallback((query: string) => {
    setSearchQuery(query);
    setView('grid');
    setSelectedCustomer(null);
    clearDetail();
  }, [clearDetail]);

  return (
    <div className={styles.webPartContainer} style={themeVars as React.CSSProperties}>
      <Navigation
        onSearch={handleNavSearch}
        activePage="contactCards"
        homeUrl="/"
      />

      {view === 'grid' && (
        <h1 className={styles.pageHeading}>{title}</h1>
      )}

      {/* ---- Grid view ---- */}
      {view === 'grid' && gridLoading && (
        <div className={styles.emptyState} role="status" aria-live="polite">
          <p>Loading customers…</p>
        </div>
      )}

      {view === 'grid' && error && !gridLoading && (
        <div className={styles.emptyState} role="alert">
          <p>{error}</p>
        </div>
      )}

      {view === 'grid' && !gridLoading && (
        <CardGridView
          allCustomers={customers}
          onCardClick={handleCardClick}
          searchQuery={searchQuery}
        />
      )}

      {/* ---- Detail view ---- */}
      {view === 'detail' && detailLoading && (
        <div className={styles.emptyState} role="status" aria-live="polite">
          <p>Loading customer details…</p>
        </div>
      )}

      {view === 'detail' && error && !detailLoading && (
        <div className={styles.emptyState} role="alert">
          <p>{error}</p>
          <button
            className={styles.clearButton}
            onClick={handleBack}
            type="button"
          >
            Back to All Contacts
          </button>
        </div>
      )}

      {view === 'detail' && selectedCustomer && !detailLoading && (
        <CustomerDetailView
          customer={selectedCustomer}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default CustomerContactCards;
