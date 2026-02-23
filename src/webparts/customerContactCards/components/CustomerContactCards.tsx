import * as React from 'react';
import styles from './CustomerContactCards.module.scss';
import { ICustomerContactCardsProps } from './ICustomerContactCardsProps';
import { MOCK_CUSTOMERS, ICustomer } from './mockData';
import CardGridView from './CardGridView';
import CustomerDetailView from './CustomerDetailView';
import { Navigation } from '../../rapidCityHomepage/components/Navigation/Navigation';
import { defaultTheme, getThemeCssVariables } from '../../rapidCityHomepage/theme/ThemeTokens';

// TODO: Replace MOCK_CUSTOMERS with live data from SharePoint List
// TODO: Use PnPjs sp.web.lists.getByTitle('CustomerContacts').items.get()
// TODO: Map SharePoint list items to ICustomer[] using a mapper function

type ViewState = 'grid' | 'detail';

const CustomerContactCards: React.FC<ICustomerContactCardsProps> = ({ title }) => {
  const [view, setView]                         = React.useState<ViewState>('grid');
  const [selectedCustomer, setSelectedCustomer] = React.useState<ICustomer | null>(null);
  const [searchQuery, setSearchQuery]           = React.useState('');

  const themeVars = React.useMemo(() => getThemeCssVariables(defaultTheme), []);

  // TODO: Replace with useEffect data fetch from SharePoint
  const customers = MOCK_CUSTOMERS;

  const handleCardClick = (customer: ICustomer): void => {
    setSelectedCustomer(customer);
    setView('detail');
    // Scroll back to top of web part on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = (): void => {
    setView('grid');
    setSelectedCustomer(null);
  };

  const handleNavSearch = React.useCallback((query: string) => {
    setSearchQuery(query);
    // If user searches while viewing a detail card, switch back to the grid
    setView('grid');
    setSelectedCustomer(null);
  }, []);

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

      {view === 'grid' && (
        <CardGridView
          allCustomers={customers}
          onCardClick={handleCardClick}
          searchQuery={searchQuery}
        />
      )}

      {view === 'detail' && selectedCustomer && (
        <CustomerDetailView
          customer={selectedCustomer}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default CustomerContactCards;
