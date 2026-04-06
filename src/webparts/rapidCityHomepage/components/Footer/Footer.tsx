import * as React from 'react';
import { FeedbackModal } from '../FeedbackModal/FeedbackModal';
import styles from './Footer.module.scss';

const COPYRIGHT = '\u00A9 2026 Rapid City Transportation - Internal Use Only';
const FEEDBACK_LABEL = 'Send Feedback';

export interface IFooterProps {
  /** Identifier for the current page context (shown in the feedback form) */
  pageIdentifier: string;
}

export const Footer: React.FC<IFooterProps> = ({ pageIdentifier }) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const openModal = React.useCallback(() => setModalOpen(true), []);
  const closeModal = React.useCallback(() => setModalOpen(false), []);

  return (
    <>
      <footer className={styles.footer} role="contentinfo">
        <span className={styles.copyright}>{COPYRIGHT}</span>
        <span className={styles.sep} aria-hidden="true">|</span>
        <button
          type="button"
          className={styles.feedback}
          onClick={openModal}
          aria-haspopup="dialog"
        >
          {FEEDBACK_LABEL}
        </button>
      </footer>

      {modalOpen && (
        <FeedbackModal
          pageIdentifier={pageIdentifier}
          onDismiss={closeModal}
        />
      )}
    </>
  );
};

export default Footer;
