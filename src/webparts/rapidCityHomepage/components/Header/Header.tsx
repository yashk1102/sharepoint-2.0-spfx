import * as React from 'react';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { IconButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import styles from './Header.module.scss';

export interface IHeaderProps {
  /** Called when user submits search; pass query to navigate to Contact Cards with q= */
  onSearch: (query: string) => void;
}

const SEARCH_PLACEHOLDER = 'Search for customer contact card';

export const Header: React.FC<IHeaderProps> = (props) => {
  const handleSearch = (newValue: string) => {
    props.onSearch(newValue || '');
  };

  return (
    <header className={styles.header} role="banner">
      <div className={styles.branding}>
        <span className={styles.logoPlaceholder} aria-hidden="true">
          RCT Logo
        </span>
        <span className={styles.title}>Rapid City Transportation Hub</span>
      </div>

      <div className={styles.searchWrapper}>
        <SearchBox
          placeholder={SEARCH_PLACEHOLDER}
          onSearch={handleSearch}
          onClear={() => props.onSearch('')}
          ariaLabel={SEARCH_PLACEHOLDER}
          className={styles.searchBox}
          showIcon
        />
      </div>

      <div className={styles.actions} role="group" aria-label="Utility actions">
        <IconButton
          iconProps={{ iconName: 'Ringer' }}
          ariaLabel="Notifications"
          title="Notifications"
          className={styles.iconBtn}
        />
        <IconButton
          iconProps={{ iconName: 'Sunny' }}
          ariaLabel="Theme or brightness"
          title="Theme"
          className={styles.iconBtn}
        />
        <IconButton
          iconProps={{ iconName: 'Settings' }}
          ariaLabel="Settings"
          title="Settings"
          className={styles.iconBtn}
        />
        <IconButton
          iconProps={{ iconName: 'Help' }}
          ariaLabel="Help"
          title="Help"
          className={styles.iconBtn}
        />
        <IconButton
          iconProps={{ iconName: 'Contact' }}
          ariaLabel="Profile"
          title="Profile"
          className={styles.iconBtn}
        />
      </div>
    </header>
  );
};

export default Header;
