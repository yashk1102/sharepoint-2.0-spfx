import * as React from 'react';
import { Icon } from '@fluentui/react/lib/Icon';
import { IQuickLink } from '../../models/IQuickLink';
import styles from './QuickLinks.module.scss';

/** Maps common icon names to Fluent UI icon names */
const ICON_MAP: Record<string, string> = {
  People: 'People',
  Contact: 'Contact',
  Org: 'Org',
  TeamsLogo: 'TeamsLogo',
  Mail: 'Mail',
  Phone: 'Phone',
  Rocket: 'Rocket',
};

export interface IQuickLinksProps {
  links: IQuickLink[];
}

export const QuickLinks: React.FC<IQuickLinksProps> = (props) => {
  return (
    <section
      className={styles.section}
      aria-labelledby="quick-links-title"
    >
      <div className={styles.card}>
        <h2 id="quick-links-title" className={styles.title}>
          Quick Links
        </h2>
        <ul className={styles.list}>
          {props.links.map((link, index) => {
            const iconName = link.iconName && ICON_MAP[link.iconName]
              ? ICON_MAP[link.iconName]
              : 'Link';
            return (
              <li key={index} className={styles.listItem}>
                <a
                  href={link.url}
                  className={styles.tile}
                  target={link.url.startsWith('http') ? '_blank' : undefined}
                  rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <Icon
                    iconName={iconName as any}
                    className={styles.tileIcon}
                    aria-hidden="true"
                  />
                  <span className={styles.tileLabel}>{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default QuickLinks;
