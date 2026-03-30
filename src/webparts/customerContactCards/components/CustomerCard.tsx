import * as React from 'react';
import styles from './CustomerContactCards.module.scss';
import { ICustomer, CustomerType } from './types';

interface ICustomerCardProps {
  customer: ICustomer;
  onClick: (customer: ICustomer) => void;
}

const TYPE_ACCENT: Record<CustomerType, string> = {
  'IME Clinic':        '#1F4C7F',
  'Treatment Clinic':  '#3A8FB7',
  'Hospital':          '#2E7D32',
  'School':            '#8A6A0C',
  'Social Services':   '#B84A00',
  'Lawyer':            '#4A5568',
  'Insurance Company': '#9B2C2C',
  'WSIB': '#952c9b',
  'Other': '#4A5568'
};

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
      <div
        className={styles.cardAvatar}
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      >
        {initials}
      </div>

      <div className={styles.cardName}>{customer.name}</div>

      <div
        className={styles.cardTypeBadge}
        style={{ color: accent, borderColor: accent }}
      >
        {customer.customerType}
      </div>
    </button>
  );
};

export default CustomerCard;
