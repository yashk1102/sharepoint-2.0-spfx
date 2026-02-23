import * as React from 'react';
import styles from './CustomerContactCards.module.scss';
import { ICustomer, CustomerType } from './mockData';

interface ICustomerCardProps {
  customer: ICustomer;
  onClick: (customer: ICustomer) => void;
}

// Accessible accent colour per customer type (all ≥ 4.5:1 on white)
const TYPE_ACCENT: Record<CustomerType, string> = {
  'IME Clinic':        '#1F4C7F', // Primary Blue  8.71:1
  'Treatment Clinic':  '#187389', // Light Blue    5.45:1
  'Hospital':          '#2E7D32', // Forest Green  5.13:1
  'School':            '#8A6A0C', // Gold Acc      5.09:1
  'Social Services':   '#B84A00', // Amber         5.10:1
  'Lawyer':            '#4A5568', // Slate         7.51:1
  'Insurance Company': '#9B2C2C', // Deep Red      7.51:1
};

// Two-letter initials from org name
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

const CustomerCard: React.FC<ICustomerCardProps> = ({ customer, onClick }) => {
  const accent = TYPE_ACCENT[customer.customerType] || '#1F4C7F';
  const initials = getInitials(customer.name);

  const handleClick = (): void => onClick(customer);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(customer);
    }
  };

  return (
    <button
      className={styles.card}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type="button"
      aria-label={`View contact card for ${customer.name}, ${customer.customerType}`}
      style={{ borderTopColor: accent }}
    >
      {/* Avatar */}
      <div
        className={styles.cardAvatar}
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      >
        {initials}
      </div>

      {/* Name */}
      <div className={styles.cardName}>{customer.name}</div>

      {/* Type badge */}
      <div
        className={styles.cardTypeBadge}
        style={{ color: accent, borderColor: accent }}
      >
        {customer.customerType}
      </div>

      {/* Meta rows */}
      <div className={styles.cardMeta}>
        <div className={styles.cardMetaRow}>
          <span className={styles.cardMetaIcon} aria-hidden="true">📞</span>
          <span>{customer.phone}</span>
        </div>
        <div className={styles.cardMetaRow}>
          <span className={styles.cardMetaIcon} aria-hidden="true">✉</span>
          <span className={styles.cardEmail}>{customer.email}</span>
        </div>
      </div>
    </button>
  );
};

export default CustomerCard;
