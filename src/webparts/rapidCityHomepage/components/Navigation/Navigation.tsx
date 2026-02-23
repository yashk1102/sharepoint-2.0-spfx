import * as React from 'react';
import {
  Dropdown,
  IDropdownOption,
  IDropdownProps,
} from '@fluentui/react/lib/Dropdown';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { IconButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import styles from './Navigation.module.scss';

export interface INavLink {
  label: string;
  href: string;
}

export interface INavDropdown {
  label: string;
  options: INavLink[];
}

const DEPARTMENT_HUBS_OPTIONS: INavLink[] = [
  { label: 'Customer Experience', href: '#' },
  { label: 'Dispatch', href: '#' },
  { label: 'Accounting', href: '#' },
  { label: 'Human Resources', href: '#' },
  { label: 'Information Technology', href: '#' },
  { label: 'Business Development', href: '#' },
  // Update hrefs to real intranet pages
];

const EMPLOYEE_SUPPORT_OPTIONS: INavLink[] = [
  { label: 'Information Technology Support', href: '#' },
  { label: 'Human Resources Support', href: '#' },
  { label: 'Health & Safety', href: '#' },
  // Update hrefs to real intranet pages
];

export type NavPage = 'home' | 'contactCards' | 'training';

export interface INavigationProps {
  onSearch: (query: string) => void;
  /** Which page is currently active — controls the highlighted nav item */
  activePage?: NavPage;
  /** URL for the Home page link (defaults to '/') */
  homeUrl?: string;
  /** URL for the Contact Cards page link (defaults to '#') */
  contactCardsUrl?: string;
}

export const Navigation: React.FC<INavigationProps> = (props) => {
  const activePage = props.activePage || 'home';
  const homeUrl = props.homeUrl || '/';
  const contactCardsUrl = props.contactCardsUrl || '#';
  const deptOptions: IDropdownOption[] = DEPARTMENT_HUBS_OPTIONS.map((o, i) => ({
    key: o.href,
    text: o.label,
    data: o,
  }));

  const supportOptions: IDropdownOption[] = EMPLOYEE_SUPPORT_OPTIONS.map((o) => ({
    key: o.href,
    text: o.label,
    data: o,
  }));

  const onDeptChange: IDropdownProps['onChange'] = (_ev, option) => {
    if (option?.data?.href) {
      window.location.assign((option.data as INavLink).href);
    }
  };

  const onSupportChange: IDropdownProps['onChange'] = (_ev, option) => {
    if (option?.data?.href) {
      window.location.assign((option.data as INavLink).href);
    }
  };

  const handleSearch = (newValue: string) => {
    props.onSearch(newValue || '');
  };

  return (
    <nav className={styles.nav} role="navigation" aria-label="Main">
      <div className={styles.navInner}>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <a
              href={homeUrl}
              className={activePage === 'home' ? styles.linkActive : styles.link}
              {...(activePage === 'home' ? { 'aria-current': 'page' as const } : {})}
            >
              Home
            </a>
          </li>
          <li className={styles.listItem}>
            <a
              href={contactCardsUrl}
              className={activePage === 'contactCards' ? styles.linkActive : styles.link}
              {...(activePage === 'contactCards' ? { 'aria-current': 'page' as const } : {})}
            >
              Contact Cards
            </a>
          </li>
          <li className={styles.listItem}>
            <Dropdown
              placeholder="Department Hubs"
              options={deptOptions}
              onChange={onDeptChange}
              className={styles.dropdown}
              ariaLabel="Department Hubs menu"
              dropdownWidth={220}
              onRenderPlaceholder={() => (
                <span className={styles.dropdownTitle}>
                  Department Hubs
                  <Icon iconName="ChevronDown" className={styles.chevron} />
                </span>
              )}
              onRenderTitle={() => (
                <span className={styles.dropdownTitle}>
                  Department Hubs
                  <Icon iconName="ChevronDown" className={styles.chevron} />
                </span>
              )}
            />
          </li>
          <li className={styles.listItem}>
            <a
              href="#"
              className={activePage === 'training' ? styles.linkActive : styles.link}
              {...(activePage === 'training' ? { 'aria-current': 'page' as const } : {})}
            >
              Training Hub
            </a>
          </li>
          <li className={styles.listItem}>
            <Dropdown
              placeholder="Employee Support"
              options={supportOptions}
              onChange={onSupportChange}
              className={styles.dropdown}
              ariaLabel="Employee Support menu"
              dropdownWidth={220}
              onRenderPlaceholder={() => (
                <span className={styles.dropdownTitle}>
                  Employee Support
                  <Icon iconName="ChevronDown" className={styles.chevron} />
                </span>
              )}
              onRenderTitle={() => (
                <span className={styles.dropdownTitle}>
                  Employee Support
                  <Icon iconName="ChevronDown" className={styles.chevron} />
                </span>
              )}
            />
          </li>
        </ul>

        <div className={styles.utilityBar} role="group" aria-label="Search and utility actions">
          <SearchBox
            placeholder="Search contact cards"
            onSearch={handleSearch}
            onClear={() => props.onSearch('')}
            ariaLabel="Search for customer contact card"
            className={styles.searchBox}
            showIcon
          />
          <IconButton
            iconProps={{ iconName: 'Ringer' }}
            ariaLabel="Notifications"
            title="Notifications"
            className={styles.utilityIcon}
          />
          <IconButton
            iconProps={{ iconName: 'Sunny' }}
            ariaLabel="Weather"
            title="Weather"
            className={styles.utilityIcon}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
