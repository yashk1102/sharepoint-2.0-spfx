import * as React from 'react';
import styles from './CustomerContactCards.module.scss';
import {
  ICustomer,
  ITabContent,
  IInstructionGroup,
  IInstructionItem,
  ServiceAmendmentOption,
  SERVICE_AMENDMENT_OPTIONS,
  CustomerType,
} from './mockData';
import AccordionSection, { IAccordionSectionHandle } from './AccordionSection';

// Type guard for nested instruction items
function isItem(x: string | IInstructionItem): x is IInstructionItem {
  return typeof x === 'object';
}

// ---- Section accent colours (WCAG AA, ≥ 4.5:1 on white) ----
const SECTION_COLORS = {
  booking:           '#1F4C7F', // Primary Blue   8.71:1
  serviceAmendments: '#9B2C2C', // Deep Red       7.51:1
  cancellations:     '#187389', // Light Blue Acc  5.45:1
  reminderCalls:     '#8A6A0C', // Gold Acc       5.09:1
  contactInfo:       '#4A5568', // Slate          7.51:1
};

// Accent per customer type (matches card)
const TYPE_ACCENT: Record<CustomerType, string> = {
  'IME Clinic':        '#1F4C7F', // Primary Blue  8.71:1
  'Treatment Clinic':  '#187389', // Light Blue    5.45:1
  'Hospital':          '#2E7D32', // Forest Green  5.13:1
  'School':            '#8A6A0C', // Gold Acc      5.09:1
  'Social Services':   '#B84A00', // Amber         5.10:1
  'Lawyer':            '#4A5568', // Slate         7.51:1
  'Insurance Company': '#9B2C2C', // Deep Red      7.51:1
};

type TabId = 'referral' | 'passenger' | 'customer';

interface ICustomerDetailViewProps {
  customer: ICustomer;
  onBack: () => void;
}

// ---- Instruction group renderer ----
const InstructionGroupList: React.FC<{ groups: IInstructionGroup[] }> = ({ groups }) => (
  <>
    {groups.map((group, idx) => (
      <div key={idx} className={styles.instructionGroup}>
        <div className={styles.instructionGroupTitle}>{group.title}</div>
        <ul className={styles.instructionList}>
          {group.items.map((item, i) => (
            <li key={i}>
              {isItem(item) ? (
                <>
                  {item.text}
                  {item.subItems && item.subItems.length > 0 && (
                    <ul className={styles.instructionSubList}>
                      {item.subItems.map((sub, j) => <li key={j}>{sub}</li>)}
                    </ul>
                  )}
                </>
              ) : item}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </>
);

// ---- Service Amendments section content ----
const ServiceAmendmentsContent: React.FC<{ tabContent: ITabContent }> = ({ tabContent }) => {
  const [selectedType, setSelectedType] = React.useState<ServiceAmendmentOption>(SERVICE_AMENDMENT_OPTIONS[0]);

  const groups = tabContent.serviceAmendments[selectedType] || [];

  return (
    <div className={styles.serviceAmendments}>
      <label className={styles.saLabel} htmlFor="sa-type-select">
        Amendment Type
      </label>
      <select
        id="sa-type-select"
        className={styles.saSelect}
        value={selectedType}
        onChange={e => setSelectedType(e.target.value as ServiceAmendmentOption)}
        aria-label="Select service amendment type"
      >
        {SERVICE_AMENDMENT_OPTIONS.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      {groups.length > 0 && (
        <div className={styles.saInstructions}>
          <InstructionGroupList groups={groups} />
        </div>
      )}
    </div>
  );
};

// ---- Helper: renders a contact person's phone + optional notes, and email ----
const ContactPersonRows: React.FC<{ contact: { phone: string; email: string; phoneNotes?: string[] } }> = ({ contact }) => (
  <ul className={styles.instructionList}>
    <li>
      Phone: {contact.phone}
      {contact.phoneNotes && contact.phoneNotes.length > 0 && (
        <ul className={styles.instructionSubList}>
          {contact.phoneNotes.map((note, i) => <li key={i}>{note}</li>)}
        </ul>
      )}
    </li>
    {contact.email && <li>Email: {contact.email}</li>}
  </ul>
);

// ---- Helper: renders escalation guidelines (supports nested IInstructionItem) ----
const EscalationList: React.FC<{ guidelines: (string | { text: string; subItems?: string[] })[] }> = ({ guidelines }) => (
  <ul className={styles.instructionList}>
    {guidelines.map((g, i) => (
      <li key={i}>
        {isItem(g) ? (
          <>
            {g.text}
            {g.subItems && g.subItems.length > 0 && (
              <ul className={styles.instructionSubList}>
                {g.subItems.map((sub, j) => <li key={j}>{sub}</li>)}
              </ul>
            )}
          </>
        ) : g}
      </li>
    ))}
  </ul>
);

// ---- Contact Information section content ----
const ContactInformationContent: React.FC<{ tabContent: ITabContent }> = ({ tabContent }) => {
  const { contactInformation } = tabContent;
  return (
    <div className={styles.contactInfoContent}>
      <div className={styles.businessHoursLabel}>
        <strong>Business Hours:</strong>
      </div>
      <div className={styles.businessHoursValue}>{contactInformation.businessHours}</div>

      <div className={styles.contactInfoGrid}>
        {/* During business hours */}
        <div className={styles.contactInfoCard}>
          <div className={styles.contactInfoCardTitle}>During Business Hours</div>
          <hr className={styles.contactInfoDivider} aria-hidden="true" />

          <div className={styles.contactInfoSection}>
            <div className={styles.contactInfoSectionTitle}>First Contact</div>
            <ContactPersonRows contact={contactInformation.during.firstContact} />
          </div>

          <div className={styles.contactInfoSection}>
            <div className={styles.contactInfoSectionTitle}>Second Contact</div>
            <ContactPersonRows contact={contactInformation.during.secondContact} />
          </div>

          <div className={styles.contactInfoSection}>
            <div className={styles.contactInfoSectionTitle}>Escalation Guidelines (Dispatch Alerts)</div>
            <EscalationList guidelines={contactInformation.during.escalationGuidelines} />
          </div>
        </div>

        {/* Outside business hours */}
        <div className={styles.contactInfoCard}>
          <div className={`${styles.contactInfoCardTitle} ${styles.contactInfoCardTitleMuted}`}>
            Outside Business Hours
          </div>
          <hr className={styles.contactInfoDivider} aria-hidden="true" />

          <div className={styles.contactInfoSection}>
            <div className={styles.contactInfoSectionTitle}>First Contact</div>
            <ContactPersonRows contact={contactInformation.outside.firstContact} />
          </div>

          <div className={styles.contactInfoSection}>
            <div className={styles.contactInfoSectionTitle}>Second Contact</div>
            <ContactPersonRows contact={contactInformation.outside.secondContact} />
          </div>

          <div className={styles.contactInfoSection}>
            <div className={styles.contactInfoSectionTitle}>Escalation Guidelines (Dispatch Alerts)</div>
            <EscalationList guidelines={contactInformation.outside.escalationGuidelines} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- Reminder Calls content ----
const ReminderCallsContent: React.FC<{ tabContent: ITabContent }> = ({ tabContent }) => {
  const { reminderCalls } = tabContent;
  return (
    <div>
      <div className={styles.instructionGroup}>
        <div className={styles.instructionGroupTitle}>Call Timing</div>
        <ul className={styles.instructionList}>
          {reminderCalls.callTiming.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </div>
      <div className={styles.instructionGroup}>
        <div className={styles.instructionGroupTitle}>Call Attempts</div>
        <ul className={styles.instructionList}>
          {reminderCalls.callAttempts.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </div>
      <div className={styles.instructionGroup}>
        <div className={styles.instructionGroupTitle}>Clinic Escalation</div>
        <ul className={styles.instructionList}>
          {reminderCalls.clinicEscalation.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </div>
    </div>
  );
};

// ================================================================
// Main detail view component
// ================================================================

const CustomerDetailView: React.FC<ICustomerDetailViewProps> = ({ customer, onBack }) => {
  const [activeTab, setActiveTab] = React.useState<TabId>('referral');
  const contactInfoRef = React.useRef<IAccordionSectionHandle>(null);

  const tabContent: ITabContent = customer[activeTab];
  const accentColor = TYPE_ACCENT[customer.customerType] || '#1F4C7F';

  const tabs: { id: TabId; label: string }[] = [
    { id: 'referral',  label: 'Referral'  },
    { id: 'passenger', label: 'Passenger' },
    { id: 'customer',  label: 'Customer'  },
  ];

  // Unique prefix per customer to avoid duplicate accordion IDs if multiple renders
  const prefix = `cust-${customer.id}-${activeTab}`;

  return (
    <article className={styles.detailView} aria-label={`Contact detail for ${customer.name}`}>

      {/* ---- Back button ---- */}
      <button
        className={styles.backButton}
        onClick={onBack}
        type="button"
        aria-label="Back to all customer contacts"
      >
        ← Back to All Contacts
      </button>

      {/* ---- Header ---- */}
      <header className={styles.detailHeader}>
        <div className={styles.detailHeaderLeft}>
          <h1 className={styles.detailName}>
            <span>{customer.name}</span>
            <span
              className={styles.detailTypePill}
              style={{ backgroundColor: accentColor }}
            >
              {customer.customerType}
            </span>
          </h1>
          <p className={styles.detailRole}>{customer.role}</p>
          <p className={styles.detailBio}>{customer.bio}</p>
        </div>

        <div className={styles.detailHeaderActions}>
          {/* Call button — scrolls to & expands Contact Information */}
          <button
            className={styles.callButton}
            type="button"
            aria-label={`View contact information for ${customer.name}`}
            onClick={() => contactInfoRef.current?.openAndScroll()}
          >
            <span aria-hidden="true">📞</span>
            <span>Call Customer</span>
          </button>

        </div>
      </header>

      <hr className={styles.headerDivider} aria-hidden="true" />

      {/* ---- Tab bar ---- */}
      <div
        role="tablist"
        aria-label="Contact context tabs"
        className={styles.tabBar}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---- Tab panel ---- */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className={styles.tabPanel}
      >
        {/* 2-column section grid — items auto-flow into 2 cols so rows align */}
        <div className={styles.sectionsGrid}>
          {/* Row 1, Col 1 — Booking */}
          <AccordionSection
            id={`${prefix}-booking`}
            title="Booking"
            accentColor={SECTION_COLORS.booking}
            defaultOpen={true}
          >
            <InstructionGroupList groups={tabContent.booking} />
          </AccordionSection>

          {/* Row 1, Col 2 — Service Amendments */}
          <AccordionSection
            id={`${prefix}-amendments`}
            title="Service Amendments"
            accentColor={SECTION_COLORS.serviceAmendments}
            defaultOpen={true}
          >
            <ServiceAmendmentsContent tabContent={tabContent} />
          </AccordionSection>

          {/* Row 2, Col 1 — Cancellations & Changes */}
          <AccordionSection
            id={`${prefix}-cancellations`}
            title="Cancellations & Changes"
            accentColor={SECTION_COLORS.cancellations}
            defaultOpen={false}
          >
            <InstructionGroupList groups={tabContent.cancellationsAndChanges} />
          </AccordionSection>

          {/* Row 2, Col 2 — Reminder Calls */}
          <AccordionSection
            id={`${prefix}-remindercalls`}
            title="Reminder Calls"
            accentColor={SECTION_COLORS.reminderCalls}
            defaultOpen={false}
          >
            <ReminderCallsContent tabContent={tabContent} />
          </AccordionSection>
        </div>

        {/* Full-width: Contact Information */}
        <div className={styles.fullWidthSection}>
          <AccordionSection
            ref={contactInfoRef}
            id={`${prefix}-contactinfo`}
            title="Contact Information"
            accentColor={SECTION_COLORS.contactInfo}
            defaultOpen={false}
          >
            <ContactInformationContent tabContent={tabContent} />
          </AccordionSection>
        </div>
      </div>
    </article>
  );
};

export default CustomerDetailView;
