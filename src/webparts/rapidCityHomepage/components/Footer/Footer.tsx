import * as React from 'react';
import styles from './Footer.module.scss';

const COPYRIGHT = '© 2025 Rapid City Transportation - Internal Use Only';
const FEEDBACK_LABEL = 'Send Feedback';
const LAST_UPDATED = 'Last Updated: December 2025';

export interface IFooterProps {
  feedbackUrl: string;
}

export const Footer: React.FC<IFooterProps> = (props) => (
  <footer className={styles.footer} role="contentinfo">
    <span className={styles.copyright}>{COPYRIGHT}</span>
    <span className={styles.sep} aria-hidden="true">|</span>
    <a
      href={props.feedbackUrl}
      className={styles.feedback}
      target={props.feedbackUrl.startsWith('http') ? '_blank' : undefined}
      rel={props.feedbackUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {FEEDBACK_LABEL}
    </a>
    <span className={styles.sep} aria-hidden="true">|</span>
    <span className={styles.updated}>{LAST_UPDATED}</span>
  </footer>
);

export default Footer;
