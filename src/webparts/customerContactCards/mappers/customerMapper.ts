// ============================================================
// Mapper — transforms raw SharePoint data into ICustomer shape
// ============================================================
//
// ASSUMPTIONS (documented for future maintainers):
//
// 1. The "Source" field on instruction blocks uses these values:
//      "Client"    → maps to the "Referral" tab
//      "Passenger" → maps to the "Passenger" tab
//      "Customer"  → maps to the "Customer" tab
//    If your list uses different values, update SOURCE_TO_TAB below.
//
// 2. Lookup columns map to accordion sections as defined in
//    LOOKUP_TO_SECTION below. Adjust if your list layout differs.
//
// 3. The "Default Text" field on instruction blocks contains multiline
//    plain text. Each non-empty line becomes a bullet item in the UI.
//
// 4. "Phone Numbers (Business Hours)" and "Phone Numbers (After Hours)"
//    are multiline text fields. The first phone-like value is extracted
//    for the card grid; the full text is parsed for the detail view.
//
// 5. There is NO dedicated "Email" column in Protocol Book Draft2.
//    If emails are embedded in the phone fields (e.g., "Email: foo@bar.com"),
//    the mapper tries to extract them. Otherwise the email shows as empty.
// ============================================================

import {
  ICustomer,
  ITabContent,
  IInstructionGroup,
  IBusinessHoursContact,
  IContactPerson,
  CustomerType,
  ServiceAmendmentOption,
} from '../components/mockData';
import {
  IProtocolBookGridItem,
  IProtocolBookDetailItem,
  IInstructionBlockRaw,
} from '../models/IProtocolBookItem';

/** Which ITabContent section each Protocol Book lookup column feeds. */
type SectionKey = 'booking' | 'cancellationsAndChanges' | 'reminderCalls';

const LOOKUP_TO_SECTION: Record<string, SectionKey> = {
  // Booking section (also feeds Service Amendments via AMENDMENT_KEY_MAP)
  ApptType: 'booking',
  ServiceType: 'booking',
  VehicleTypePolicy: 'booking',
  ReturnTimesPolicy: 'booking',
  WaitTimes: 'booking',
  // Reminder Calls section (ConfirmationCall only — WaitTimes is NOT here)
  ConfirmationCall: 'reminderCalls',
  // Cancellations & Changes section
  ChangePolicy: 'cancellationsAndChanges',
  CancelPolicy: 'cancellationsAndChanges',
};

/**
 * Maps instruction block titles/categories to SERVICE_AMENDMENT_OPTIONS keys
 * so the Service Amendments dropdown can find the right content.
 * Expand this map as new amendment types appear in your list.
 */
const AMENDMENT_KEY_MAP: Record<string, ServiceAmendmentOption> = {
  // Category-based
  'Wait Times': 'Wait & Return',
  'Wait Time': 'Wait & Return',
  'Return Times': 'Wait & Return',
  'Vehicle Type': 'Fleet-Only Service',
  // Title-pattern based (add more as needed)
  Stretcher: 'Stretcher Requirements',
  'Toll Road': 'Toll Roads (407 / 412)',
  'Address Alert': 'Address Alerts',
  'Flight': 'Flight / Hotels',
  'Group Travel': 'Group Travel (Multiple Passengers)',
  'Driver Transfer': 'Driver Transfer',
  'Assessor Transfer': 'Assessor Transfer',
  TSP: 'TSP',
};

// ---- Grid mapper (lightweight) ----

/**
 * Map a list of Protocol Book grid items to ICustomer[] for the card grid.
 * Only populates the fields the card + filter/search need.
 * Tab content is left as empty stubs — it will be populated on detail fetch.
 */
export function mapGridItemsToCustomers(items: IProtocolBookGridItem[]): ICustomer[] {
  return items.map(item => {
    const phone = extractFirstPhone(item.PhoneBusinessHours);
    const email = extractEmail(item.PhoneBusinessHours);

    return {
      id: String(item.Id),
      name: item.Title || item.ClientName || '',
      customerType: mapCustomerType(item.ClientType),
      role: item.ClientRole || '',
      bio: item.Specification || '',
      phone,
      email,
      // Stub tab content — will be hydrated when user opens detail
      referral: emptyTabContent(),
      passenger: emptyTabContent(),
      customer: emptyTabContent(),
    };
  });
}

// ---- Detail mapper (full) ----

/**
 * Map a fully-expanded Protocol Book item into a complete ICustomer
 * with all three tab contents populated from instruction blocks.
 */
export function mapDetailItemToCustomer(item: IProtocolBookDetailItem): ICustomer {
  const phone = extractFirstPhone(item.PhoneBusinessHours);
  const email = extractEmail(item.PhoneBusinessHours);
  const orgName = item.ClientName || item.Title || '';

  // Collect ALL instruction blocks from every lookup, tagged with their source column
  const blocksByTab = collectBlocksByTab(item);

  // Build tab content for each of the 3 tabs
  const referralBlocks = blocksByTab.Client || {};
  const passengerBlocks = blocksByTab.Passenger || {};
  const customerBlocks = blocksByTab.Customer || {};

  return {
    id: String(item.Id),
    name: item.Title || orgName,
    customerType: mapCustomerType(item.ClientType),
    role: item.ClientRole || '',
    bio: item.Specification || '',
    phone,
    email,
    referral: buildTabContent(referralBlocks, item, orgName),
    passenger: buildTabContent(passengerBlocks, item, orgName),
    customer: buildTabContent(customerBlocks, item, orgName),
  };
}

// ============================================================
// Internal helpers
// ============================================================

// -- Tab content builder --

type BlocksBySection = Partial<Record<SectionKey, IInstructionBlockRaw[]>>;

/**
 * Organize all instruction blocks from expanded lookups into
 * { [Source]: { [SectionKey]: IInstructionBlockRaw[] } }
 */
function collectBlocksByTab(
  item: IProtocolBookDetailItem
): Record<string, BlocksBySection> {
  const result: Record<string, BlocksBySection> = {};

  const lookupEntries: Array<{ key: string; blocks: IInstructionBlockRaw[] }> = [
    { key: 'ApptType', blocks: item.ApptType ? [item.ApptType] : [] },
    { key: 'ServiceType', blocks: item.ServiceType || [] },
    { key: 'VehicleTypePolicy', blocks: item.VehicleTypePolicy || [] },
    { key: 'ReturnTimesPolicy', blocks: item.ReturnTimesPolicy ? [item.ReturnTimesPolicy] : [] },
    { key: 'ConfirmationCall', blocks: item.ConfirmationCall || [] },
    { key: 'WaitTimes', blocks: item.WaitTimes ? [item.WaitTimes] : [] },
    { key: 'ChangePolicy', blocks: item.ChangePolicy || [] },
    { key: 'CancelPolicy', blocks: item.CancelPolicy || [] },
  ];

  for (const { key, blocks } of lookupEntries) {
    const section = LOOKUP_TO_SECTION[key];
    if (!section) continue;

    for (const block of blocks) {
      // Use the block's Source field to determine which tab it belongs to.
      // If Source is missing, put it in all tabs (defensive).
      const sources: string[] = block.Source
        ? [block.Source]
        : ['Client', 'Passenger', 'Customer'];

      for (const source of sources) {
        if (!result[source]) result[source] = {};
        if (!result[source][section]) result[source][section] = [];
        result[source][section]!.push(block);
      }
    }
  }

  return result;
}

/**
 * Build a complete ITabContent for one tab from collected instruction blocks.
 *
 * Service Amendments is NOT a lookup — it's a frontend-only dropdown whose
 * content is derived from the same booking blocks filtered by Category.
 */
function buildTabContent(
  sections: BlocksBySection,
  item: IProtocolBookDetailItem,
  orgName: string
): ITabContent {
  return {
    booking: buildInstructionGroups(sections.booking),
    serviceAmendments: buildServiceAmendments(sections.booking),
    cancellationsAndChanges: buildInstructionGroups(sections.cancellationsAndChanges),
    reminderCalls: buildReminderCalls(sections.reminderCalls, item.ProblemWithReminderCall),
    contactInformation: buildContactInformation(item, orgName),
  };
}

// -- Section builders --

/**
 * Convert instruction blocks into IInstructionGroup[].
 * Each block becomes one group: Title → group title, DefaultText lines → items.
 */
function buildInstructionGroups(
  blocks: IInstructionBlockRaw[] | undefined
): IInstructionGroup[] {
  if (!blocks || blocks.length === 0) return [];

  return blocks.map(block => ({
    title: block.Title || 'Instructions',
    items: parseMultilineToItems(block.DefaultText, block.Description),
  }));
}

/**
 * Map instruction blocks into the ServiceAmendments Record structure.
 * Tries to match each block to a SERVICE_AMENDMENT_OPTION key.
 */
function buildServiceAmendments(
  blocks: IInstructionBlockRaw[] | undefined
): Partial<Record<ServiceAmendmentOption, IInstructionGroup[]>> {
  if (!blocks || blocks.length === 0) return {};

  const result: Partial<Record<ServiceAmendmentOption, IInstructionGroup[]>> = {};

  for (const block of blocks) {
    const amendmentKey = resolveAmendmentKey(block);
    if (!amendmentKey) continue;

    if (!result[amendmentKey]) result[amendmentKey] = [];
    result[amendmentKey]!.push({
      title: block.Title || 'Instructions',
      items: parseMultilineToItems(block.DefaultText, block.Description),
    });
  }

  return result;
}

/**
 * Build the reminderCalls sub-structure.
 * Uses ConfirmationCall instruction blocks as groups,
 * plus the plain-text ProblemWithReminderCall field.
 * NOTE: WaitTimes goes to Service Amendments ("Wait & Return"), NOT here.
 */
function buildReminderCalls(
  blocks: IInstructionBlockRaw[] | undefined,
  problemWithReminderCall?: string
): ITabContent['reminderCalls'] {
  return {
    instructionGroups: buildInstructionGroups(blocks),
    problemWithReminderCall: problemWithReminderCall ? stripHtml(problemWithReminderCall).trim() || undefined : undefined,
  };
}

/**
 * Build contact information from the Protocol Book item's flat fields.
 * Parses the multiline phone fields into the structured contact format.
 */
function buildContactInformation(
  item: IProtocolBookDetailItem,
  orgName: string
): ITabContent['contactInformation'] {
  const businessLines = splitLines(item.PhoneBusinessHours ? stripHtml(item.PhoneBusinessHours) : undefined);
  const afterLines = splitLines(item.PhoneAfterHours ? stripHtml(item.PhoneAfterHours) : undefined);

  return {
    businessHours: 'Monday - Friday | 8:30 AM - 5:00 PM EST',
    during: parseContactBlock(businessLines, orgName),
    outside: parseContactBlock(afterLines, orgName),
  };
}

// ============================================================
// Parsing utilities
// ============================================================

/**
 * Strip HTML markup from SharePoint Rich Text (Note) fields.
 * Converts block-level elements to newlines, removes tags, decodes entities.
 */
function stripHtml(html: string): string {
  let text = html;

  // Convert block-level closing tags and <br> to newlines
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/(?:div|p|li|tr|h[1-6])>/gi, '\n');
  text = text.replace(/<\/(?:ol|ul|table)>/gi, '\n');

  // Remove all remaining HTML tags
  text = text.replace(/<[^>]*>/g, '');

  // Decode common HTML entities
  text = text
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(Number(code)));

  return text;
}

/** Split multiline text into non-empty trimmed lines. */
function splitLines(text?: string): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);
}

/**
 * Parse multiline DefaultText + Description into instruction items.
 * Strips HTML markup (SharePoint Rich Text fields return HTML),
 * then splits into non-empty lines.
 */
function parseMultilineToItems(
  defaultText?: string,
  description?: string
): string[] {
  const items: string[] = [];

  if (defaultText) {
    items.push(...splitLines(stripHtml(defaultText)));
  }
  if (description) {
    items.push(...splitLines(stripHtml(description)));
  }

  return items.length > 0 ? items : ['No instructions available.'];
}

/**
 * Extract the first phone-number-like string from multiline text.
 * Looks for patterns like "905-678-2924", "(416) 927-7745", "1-800-555-1234".
 */
function extractFirstPhone(text?: string): string {
  if (!text) return '';
  const clean = stripHtml(text);
  const match = clean.match(/[\d(][\d\s().-]{6,}[\d)]/);
  return match ? match[0].trim() : splitLines(clean)[0] || '';
}

/**
 * Try to extract an email address from multiline text.
 */
function extractEmail(text?: string): string {
  if (!text) return '';
  const clean = stripHtml(text);
  const match = clean.match(/[\w.+-]+@[\w.-]+\.\w{2,}/);
  return match ? match[0] : '';
}

/**
 * Map a ClientType string from SP to the CustomerType union.
 * Falls back to 'IME Clinic' if the value doesn't match known types.
 */
function mapCustomerType(raw?: string): CustomerType {
  const known: CustomerType[] = [
    'IME Clinic',
    'Treatment Clinic',
    'Hospital',
    'School',
    'Social Services',
    'Lawyer',
    'Insurance Company',
  ];

  if (raw && known.indexOf(raw as CustomerType) !== -1) {
    return raw as CustomerType;
  }

  // Try partial matching
  if (raw) {
    const lower = raw.toLowerCase();
    for (const t of known) {
      if (lower.includes(t.toLowerCase()) || t.toLowerCase().includes(lower)) {
        return t;
      }
    }
  }

  return 'IME Clinic'; // safe fallback
}

/**
 * Determine which SERVICE_AMENDMENT_OPTION key a block maps to.
 */
function resolveAmendmentKey(
  block: IInstructionBlockRaw
): ServiceAmendmentOption | undefined {
  const title = block.Title || '';
  const category = block.Category || '';

  // Try exact category match first
  const patterns = Object.keys(AMENDMENT_KEY_MAP);
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    const key = AMENDMENT_KEY_MAP[pattern];
    if (
      category.toLowerCase().indexOf(pattern.toLowerCase()) !== -1 ||
      title.toLowerCase().indexOf(pattern.toLowerCase()) !== -1
    ) {
      return key;
    }
  }

  // Fallback: use the block title as a best-effort key
  // (won't match the dropdown unless it exactly matches a SERVICE_AMENDMENT_OPTION)
  return undefined;
}

/**
 * Parse an array of text lines (from a phone field) into the structured
 * IBusinessHoursContact format with firstContact, secondContact, and escalation.
 */
function parseContactBlock(lines: string[], orgName: string): IBusinessHoursContact {
  const phones: string[] = [];
  const emails: string[] = [];
  const otherLines: string[] = [];

  for (const line of lines) {
    const emailMatch = line.match(/[\w.+-]+@[\w.-]+\.\w{2,}/);
    const phoneMatch = line.match(/[\d(][\d\s().-]{6,}[\d)]/);

    if (emailMatch) {
      emails.push(emailMatch[0]);
    }
    if (phoneMatch) {
      phones.push(phoneMatch[0].trim());
    }
    if (!emailMatch && !phoneMatch) {
      otherLines.push(line);
    }
  }

  const firstContact: IContactPerson = {
    phone: phones[0] || '',
    email: emails[0] || '',
    phoneNotes: otherLines.length > 0 ? otherLines : undefined,
  };

  const secondContact: IContactPerson = {
    phone: phones[1] || phones[0] || '',
    email: emails[1] || emails[0] || '',
  };

  const escalationGuidelines: string[] = lines.length > 0
    ? [`Contact ${orgName} dispatch for all trip-related inquiries.`]
    : [];

  return {
    firstContact,
    secondContact,
    escalationGuidelines,
  };
}

/**
 * Returns a completely empty ITabContent — used as a stub for grid items
 * that haven't been hydrated with detail data yet.
 */
function emptyTabContent(): ITabContent {
  return {
    booking: [],
    serviceAmendments: {},
    cancellationsAndChanges: [],
    reminderCalls: { instructionGroups: [] },
    contactInformation: {
      businessHours: '',
      during: {
        firstContact: { phone: '', email: '' },
        secondContact: { phone: '', email: '' },
        escalationGuidelines: [],
      },
      outside: {
        firstContact: { phone: '', email: '' },
        secondContact: { phone: '', email: '' },
        escalationGuidelines: [],
      },
    },
  };
}
