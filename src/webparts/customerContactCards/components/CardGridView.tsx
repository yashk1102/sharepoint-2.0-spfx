import * as React from 'react';
import styles from './CustomerContactCards.module.scss';
import { ICustomer, CustomerType, CUSTOMER_TYPES } from './mockData';
import CustomerCard from './CustomerCard';

const PAGE_SIZE = 12;

interface ICardGridViewProps {
  allCustomers: ICustomer[];
  onCardClick: (customer: ICustomer) => void;
  /** Optional external search query (e.g. from the nav bar search) */
  searchQuery?: string;
}

const CardGridView: React.FC<ICardGridViewProps> = ({ allCustomers, onCardClick, searchQuery }) => {
  const [filterType, setFilterType]   = React.useState<CustomerType | 'All'>('All');
  const [searchText, setSearchText]   = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  // Sync from nav-bar search into local search state
  React.useEffect(() => {
    if (searchQuery !== undefined) {
      setSearchText(searchQuery);
    }
  }, [searchQuery]);

  // ---- Filtering & searching ----
  const filtered = React.useMemo(() => {
    let list = allCustomers;
    if (filterType !== 'All') {
      list = list.filter(c => c.customerType === filterType);
    }
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      list = list.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.customerType.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allCustomers, filterType, searchText]);

  // Reset to page 1 when filter/search changes
  React.useEffect(() => { setCurrentPage(1); }, [filterType, searchText]);

  const totalPages   = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage     = Math.min(currentPage, totalPages);
  const pageStart    = (safePage - 1) * PAGE_SIZE;
  const pageItems    = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  // ---- Count label ----
  const countLabel = React.useMemo(() => {
    const n = filtered.length;
    const plural = filterType === 'All'
      ? (n === 1 ? 'Contact' : 'Contacts')
      : `${filterType}${n !== 1 ? 's' : ''}`;
    return `Showing ${n} ${plural}`;
  }, [filtered.length, filterType]);

  // ---- Handlers ----
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setFilterType(e.target.value as CustomerType | 'All');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(e.target.value);
  };

  const clearFilter = (): void => {
    setFilterType('All');
    setSearchText('');
  };

  const goToPage = (page: number): void => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const isFiltered = filterType !== 'All' || searchText.trim() !== '';

  return (
    <div className={styles.gridView}>
      {/* ---- Filter bar ---- */}
      <div className={styles.filterBar} role="search" aria-label="Customer filter controls">

        {/* Left: type filter + clear */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="ccc-type-filter">
            Customer Type
          </label>
          <div className={styles.filterChip}>
            <select
              id="ccc-type-filter"
              className={styles.filterSelect}
              value={filterType}
              onChange={handleFilterChange}
              aria-label="Filter by customer type"
            >
              <option value="All">All Types</option>
              {CUSTOMER_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {isFiltered && (
            <button
              className={styles.clearButton}
              onClick={clearFilter}
              type="button"
              aria-label="Clear all filters and search"
            >
              Clear
            </button>
          )}
        </div>

        {/* Centre: search */}
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon} aria-hidden="true">🔍</span>
          <input
            id="ccc-search"
            type="search"
            className={styles.searchInput}
            placeholder="Search Customers"
            value={searchText}
            onChange={handleSearchChange}
            aria-label="Search customers by name, type, phone, or email"
          />
        </div>

        {/* Right: count */}
        <div className={styles.countText} aria-live="polite" aria-atomic="true">
          {countLabel}
        </div>
      </div>

      {/* ---- Card grid ---- */}
      {pageItems.length > 0 ? (
        <div
          className={styles.cardGrid}
          role="list"
          aria-label={`Customer contact cards — ${countLabel}`}
        >
          {pageItems.map(customer => (
            <div key={customer.id} role="listitem">
              <CustomerCard customer={customer} onClick={onCardClick} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState} role="status">
          <p>No customers match your search or filter.</p>
          <button
            className={styles.clearButton}
            onClick={clearFilter}
            type="button"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ---- Pagination ---- */}
      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Page navigation">
          <button
            className={styles.pageBtn}
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage <= 1}
            aria-label="Previous page"
            type="button"
          >
            ‹
          </button>

          <span className={styles.pageIndicator} aria-current="page" aria-label={`Page ${safePage} of ${totalPages}`}>
            {safePage} / {totalPages}
          </span>

          <button
            className={styles.pageBtn}
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage >= totalPages}
            aria-label="Next page"
            type="button"
          >
            ›
          </button>
        </nav>
      )}
    </div>
  );
};

export default CardGridView;
