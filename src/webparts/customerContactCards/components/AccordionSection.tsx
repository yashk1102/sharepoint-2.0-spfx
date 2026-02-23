import * as React from 'react';
import styles from './CustomerContactCards.module.scss';

export interface IAccordionSectionProps {
  id: string;
  title: string;
  /** CSS colour value used for the title and border accent */
  accentColor: string;
  /** Open on first render */
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/** Methods exposed via ref */
export interface IAccordionSectionHandle {
  /** Expand the section and smoothly scroll it into view */
  openAndScroll: () => void;
}

const AccordionSection = React.forwardRef<IAccordionSectionHandle, IAccordionSectionProps>(
  ({ id, title, accentColor, defaultOpen = false, children }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const rootRef = React.useRef<HTMLDivElement>(null);

    const headingId = `accordion-heading-${id}`;
    const panelId  = `accordion-panel-${id}`;

    const toggle = (): void => setIsOpen(prev => !prev);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    };

    React.useImperativeHandle(ref, () => ({
      openAndScroll: () => {
        setIsOpen(true);
        // Allow the DOM to update before scrolling
        requestAnimationFrame(() => {
          rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      },
    }));

    return (
      <div
        ref={rootRef}
        className={styles.accordionSection}
        style={{ borderTopColor: accentColor }}
      >
        <button
          id={headingId}
          className={styles.accordionHeader}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls={panelId}
          type="button"
        >
          <span className={styles.accordionTitle} style={{ color: accentColor }}>
            {title}
          </span>
          <span
            className={`${styles.accordionChevron} ${isOpen ? styles.accordionChevronOpen : ''}`}
            aria-hidden="true"
          >
            ›
          </span>
        </button>

        <div
          id={panelId}
          role="region"
          aria-labelledby={headingId}
          className={`${styles.accordionBody} ${isOpen ? styles.accordionBodyOpen : ''}`}
        >
          <div className={styles.accordionBodyInner}>
            {children}
          </div>
        </div>
      </div>
    );
  },
);

AccordionSection.displayName = 'AccordionSection';

export default AccordionSection;
