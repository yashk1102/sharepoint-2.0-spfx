export type CustomerType =
  | 'IME Clinic'
  | 'Treatment Clinic'
  | 'Hospital'
  | 'School'
  | 'Social Services'
  | 'Lawyer'
  | 'Insurance Company'
  | 'WSIB'
  | 'Other';

export const CUSTOMER_TYPES: CustomerType[] = [
  'IME Clinic',
  'Treatment Clinic',
  'Hospital',
  'School',
  'Social Services',
  'Lawyer',
  'Insurance Company',
  'WSIB',
  'Other',
];

export interface IInstructionItem {
  text: string;
  subItems?: string[];
}

export interface IInstructionGroup {
  title: string;
  description?: string;
  items: (string | IInstructionItem)[];
  /** Raw HTML from SharePoint DefaultText — rendered directly for non-address groups. */
  rawHtml?: string;
  /** "Approval to Modify" status from the SharePoint instruction block (e.g. Proceed, Needs Approval, Proceed IF). */
  approvalToModify?: string;
}

export interface ITabContent {
  booking: IInstructionGroup[];
  serviceAmendments: IInstructionGroup[];
  waitTime?: IInstructionGroup;
  cancellationsAndChanges: IInstructionGroup[];
  reminderCalls: {
    instructionGroups: IInstructionGroup[];
    problemWithReminderCall?: string;
  };
  contactInformation: {
    businessHours: string;
    duringHoursHtml?: string;
    outsideHoursHtml?: string;
  };
}

export type TabId = 'referral' | 'passenger' | 'customer';

export interface ICustomer {
  id: string;
  name: string;
  customerType: CustomerType;
  /** The original ClientType label from SharePoint — displayed on the detail page. */
  customerTypeDisplay: string;
  bio: string;
  phone: string;
  email: string;
  referral: ITabContent;
  passenger: ITabContent;
  customer: ITabContent;

  /** Which tabs to show in the UI — derived from ClientRole. */
  visibleTabs: TabId[];
  /** Original ClientRole value from SharePoint. */
  clientRole?: string;

  // Flat fields (not per-tab — same value regardless of active tab)
  accountNumber?: string;
  customerField?: string;
  passengerName?: string;
  specialInstructions?: string;
  okToBill3rdParty?: string;
  passengerNotes?: string;
  unitInfo?: string;
  tripNotes?: string;
  referralOptions?: string;
  confirmationsSpecific?: string;
}
