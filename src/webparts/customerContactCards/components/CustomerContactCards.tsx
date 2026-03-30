import * as React from 'react';
import styles from './CustomerContactCards.module.scss';
import { ICustomerContactCardsProps } from './ICustomerContactCardsProps';
import { ICustomer } from './types';
import CardGridView from './CardGridView';
import CustomerDetailView from './CustomerDetailView';
import { Navigation } from '../../rapidCityHomepage/components/Navigation/Navigation';
import { defaultTheme, getThemeCssVariables } from '../../rapidCityHomepage/theme/ThemeTokens';
import { Footer } from '../../rapidCityHomepage/components/Footer/Footer';
import { useProtocolBook } from '../hooks/useProtocolBook';

type ViewState = 'grid' | 'detail';

const CustomerContactCards: React.FC<ICustomerContactCardsProps> = ({ title }) => {
  const [view, setView]                         = React.useState<ViewState>('grid');
  const [selectedCustomer, setSelectedCustomer] = React.useState<ICustomer | null>(null);
  const [searchQuery, setSearchQuery]           = React.useState('');

  const themeVars = React.useMemo(() => getThemeCssVariables(defaultTheme), []);

  const {
    customers,
    customerDetail,
    gridLoading,
    detailLoading,
    error,
    loadCustomerDetail,
    clearDetail,
  } = useProtocolBook();

  React.useEffect(() => {
    if (customerDetail && view === 'detail') {
      setSelectedCustomer(customerDetail);
    }
  }, [customerDetail, view]);

  const handleCardClick = React.useCallback((customer: ICustomer): void => {
    setSelectedCustomer(customer);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const numericId = parseInt(customer.id, 10);
    if (!isNaN(numericId)) {
      loadCustomerDetail(numericId).catch(() => {});
    }
  }, [loadCustomerDetail]);

  const handleBack = React.useCallback((): void => {
    setView('grid');
    setSelectedCustomer(null);
    clearDetail();
  }, [clearDetail]);

  // Handle ?id= URL param from search dropdown navigation
  const urlIdHandled = React.useRef(false);
  React.useEffect(() => {
    if (urlIdHandled.current || customers.length === 0 || gridLoading) return;
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    if (!idParam) return;

    urlIdHandled.current = true;
    const match = customers.find(c => c.id === idParam);
    if (match) {
      handleCardClick(match);
    }
  }, [customers, gridLoading, handleCardClick]);

  const handleNavSearch = React.useCallback((query: string) => {
    setSearchQuery(query);
    setView('grid');
    setSelectedCustomer(null);
    clearDetail();
  }, [clearDetail]);

  const handleCustomerSelect = React.useCallback((customerId: string) => {
    const match = customers.find(c => c.id === customerId);
    if (match) {
      handleCardClick(match);
    }
  }, [customers, handleCardClick]);

  const feedbackPageId = view === 'detail' && selectedCustomer
    ? `${selectedCustomer.name} Customer Contact Card`
    : 'Customer Contact Cards Page';

  return (
    <div className={styles.webPartContainer} style={themeVars as React.CSSProperties}>
      <Navigation
        onSearch={handleNavSearch}
        onCustomerSelect={handleCustomerSelect}
        activePage="contactCards"
        homeUrl="https://rapidcitytransport.sharepoint.com/sites/HomeTest"
      />

      {view === 'grid' && (
        <h1 className={styles.pageHeading}>{title}</h1>
      )}

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

      <Footer pageIdentifier={feedbackPageId} />
    </div>
  );
};

export default CustomerContactCards;
