import * as React from 'react';
import styles from './CustomerContactCards.module.scss';

export interface IAccordionSectionProps {
  id: string;
  title: string;
  accentColor: string;
  defaultOpen?: boolean;
  /** Controlled mode: parent manages open state */
  isOpen?: boolean;
  onToggle?: () => void;
  /** Optional badge rendered beside the title */
  badge?: React.ReactNode;
  children: React.ReactNode;
}

export interface IAccordionSectionHandle {
  openAndScroll: () => void;
}

const AccordionSection = React.forwardRef<IAccordionSectionHandle, IAccordionSectionProps>(
  ({ id, title, accentColor, defaultOpen = false, isOpen: controlledOpen, onToggle, badge, children }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const rootRef = React.useRef<HTMLDivElement>(null);

    const isControlled = controlledOpen !== undefined && onToggle !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const headingId = `accordion-heading-${id}`;
    const panelId  = `accordion-panel-${id}`;

    const toggle = (): void => {
      if (isControlled) {
        onToggle();
      } else {
        setInternalOpen(prev => !prev);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    };

    React.useImperativeHandle(ref, () => ({
      openAndScroll: () => {
        if (isControlled) {
          if (!controlledOpen) onToggle();
        } else {
          setInternalOpen(true);
        }
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
            {badge && <>{' '}{badge}</>}
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
