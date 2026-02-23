// ============================================================
// Customer Contact Cards — Mock Data
// TODO: Replace with SharePoint List calls when wiring up data
// ============================================================

export type CustomerType =
  | 'IME Clinic'
  | 'Treatment Clinic'
  | 'Hospital'
  | 'School'
  | 'Social Services'
  | 'Lawyer'
  | 'Insurance Company';

export const CUSTOMER_TYPES: CustomerType[] = [
  'IME Clinic',
  'Treatment Clinic',
  'Hospital',
  'School',
  'Social Services',
  'Lawyer',
  'Insurance Company',
];

export const SERVICE_AMENDMENT_OPTIONS = [
  'Address Alerts',
  'Toll Roads (407 / 412)',
  'Wait & Return',
  'Stretcher Requirements',
  'Flight / Hotels',
  'Group Travel (Multiple Passengers)',
  'Driver Transfer',
  'Assessor Transfer',
  'Fleet-Only Service',
  'TSP',
] as const;

export type ServiceAmendmentOption = typeof SERVICE_AMENDMENT_OPTIONS[number];

// ---- Data interfaces ----

/** A single instruction item — optionally with nested sub-bullets */
export interface IInstructionItem {
  text: string;
  subItems?: string[];
}

export interface IInstructionGroup {
  title: string;
  items: (string | IInstructionItem)[];
}

export interface IContactPerson {
  phone: string;
  email: string;
  /** Optional time-based or contextual notes shown under the phone number */
  phoneNotes?: string[];
}

export interface IBusinessHoursContact {
  firstContact: IContactPerson;
  secondContact: IContactPerson;
  escalationGuidelines: (string | IInstructionItem)[];
}

export interface ITabContent {
  booking: IInstructionGroup[];
  /** Map of amendment type → instruction groups */
  serviceAmendments: Partial<Record<ServiceAmendmentOption, IInstructionGroup[]>>;
  cancellationsAndChanges: IInstructionGroup[];
  reminderCalls: {
    callTiming: string[];
    callAttempts: string[];
    clinicEscalation: string[];
  };
  contactInformation: {
    businessHours: string;
    during: IBusinessHoursContact;
    outside: IBusinessHoursContact;
  };
}

export interface ICustomer {
  id: string;
  name: string;
  customerType: CustomerType;
  role: string;
  bio: string;
  phone: string;
  email: string;
  /** Referral tab content */
  referral: ITabContent;
  /** Passenger tab content */
  passenger: ITabContent;
  /** Customer tab content */
  customer: ITabContent;
}

// ---- Helper: generate tab content ----

function makeTabContent(
  orgName: string,
  phone: string,
  altPhone: string,
  email: string,
  altEmail: string,
  contextLabel: string
): ITabContent {
  return {
    booking: [
      {
        title: 'Standard Booking',
        items: [
          `Call dispatch at ${phone} to schedule a ${contextLabel} trip.`,
          'Provide patient/claimant name, date of birth, and appointment details.',
          'Confirm pickup location and destination address at time of booking.',
        ],
      },
      {
        title: 'Online Booking',
        items: [
          'Submit booking requests via the online portal at least 48 hours in advance.',
          `Reference ${orgName} account number when booking online.`,
          'Portal confirmations are sent to the registered email on file.',
        ],
      },
      {
        title: 'Special Instructions',
        items: [
          'Notify dispatch of any mobility aids or medical equipment required.',
          'Confirm appointment time 24 hours before scheduled pickup.',
        ],
      },
    ],
    serviceAmendments: {
      'Address Alerts': [{ title: 'Instructions', items: [
        'Notify dispatch immediately if the pickup or drop-off address changes.',
        'Provide the updated address at least 2 hours before scheduled pickup.',
        'Address changes made within 1 hour of pickup may incur additional charges.',
      ]}],
      'Toll Roads (407 / 412)': [{ title: 'Instructions', items: [
        'Toll road usage must be pre-authorized by the account holder.',
        'Default routing avoids 407/412 unless pre-approved in writing.',
        'Pre-authorization form is available through the booking portal.',
      ]}],
      'Wait & Return': [{ title: 'Instructions', items: [
        'Wait & Return trips must be booked as a single round-trip at time of scheduling.',
        'Maximum uncompensated wait time is 2 hours unless pre-approved by dispatch.',
        'Driver will wait in the designated vehicle staging area.',
      ]}],
      'Stretcher Requirements': [{ title: 'Instructions', items: [
        'Stretcher-capable vehicles must be requested at time of booking.',
        'Provide medical equipment details and any special handling instructions.',
        'Stretcher vehicles have limited availability — book at least 72 hours in advance.',
      ]}],
      'Flight / Hotels': [{ title: 'Instructions', items: [
        'Provide airline name, flight number, and arrival/departure time at booking.',
        'Hotel name and full address required for all pickup/drop-off trips.',
        'Contact dispatch immediately if the flight is delayed, cancelled, or rescheduled.',
      ]}],
      'Group Travel (Multiple Passengers)': [{ title: 'Instructions', items: [
        'Group bookings (3+ passengers) require at least 5 business days advance notice.',
        'Provide a full passenger list with names and any individual special requirements.',
        'Vehicle capacity limits apply — separate bookings may be required for large groups.',
      ]}],
      'Driver Transfer': [{ title: 'Instructions', items: [
        'Driver transfer requests must be submitted through the dispatch supervisor.',
        'Valid reasons include language barrier, medical accommodation, or documented concern.',
        'Requests are accommodated subject to driver availability and scheduling constraints.',
      ]}],
      'Assessor Transfer': [{ title: 'Instructions', items: [
        'Assessor transfer bookings require a valid case ID and the assessor full name.',
        'Provide the preferred pickup window and the assessor office address.',
        'Confirm the appointment 24 hours in advance with both assessor and dispatch.',
      ]}],
      'Fleet-Only Service': [{ title: 'Instructions', items: [
        'Fleet-only service is available for pre-approved accounts only.',
        'All fleet vehicles are company-owned and operated by certified RCT drivers.',
        'Contact your account manager to enable fleet-only routing for your account.',
      ]}],
      'TSP': [{ title: 'Instructions', items: [
        'Transportation Service Provider (TSP) trips follow the standard dispatch protocol.',
        'A valid TSP authorization number must be provided at time of booking.',
        'Trip completion reports are available via the portal within 48 hours.',
      ]}],
    },
    cancellationsAndChanges: [
      {
        title: 'Cancellation Policy',
        items: [
          'Cancellations must be made at least 4 hours before the scheduled pickup.',
          `Late cancellations (< 4 hours) may be subject to a fee. Call ${phone}.`,
          'Same-day cancellations require verbal confirmation with dispatch.',
        ],
      },
      {
        title: 'Trip Changes',
        items: [
          'Time and address changes require a minimum of 2 hours advance notice.',
          'Changes are subject to vehicle and driver availability.',
          'All changes must be confirmed verbally and via the booking portal.',
        ],
      },
      {
        title: 'Special Instructions',
        items: [
          'Document all cancellations and changes in the booking portal for audit tracking.',
          'Recurring cancellation patterns may trigger a service review by account management.',
        ],
      },
    ],
    reminderCalls: {
      callTiming: [
        'First reminder call placed 24 hours before the scheduled pickup.',
        'Second reminder placed 2 hours before pickup.',
        'Calls are placed to the primary contact number on file.',
      ],
      callAttempts: [
        'Up to 3 call attempts will be made per reminder window.',
        'If no answer, a voicemail will be left with trip details.',
        'After 3 unanswered attempts, dispatch will flag the trip for supervisor follow-up.',
      ],
      clinicEscalation: [
        `If the passenger cannot be reached, contact ${orgName} scheduling at ${phone}.`,
        `Escalation email will be sent to ${email} when a trip is at risk of being missed.`,
        'Dispatch supervisor is notified for same-day at-risk trips.',
      ],
    },
    contactInformation: {
      businessHours: 'Monday - Friday | 8:30 AM - 5:00 PM EST',
      during: {
        firstContact: { phone, email },
        secondContact: { phone: altPhone, email: altEmail },
        escalationGuidelines: [
          'Call the main dispatch line first for all trip-related inquiries.',
          `Escalate to ${email} if no response within 15 minutes.`,
          'For urgent patient or claimant situations, page the on-call coordinator.',
        ],
      },
      outside: {
        firstContact: { phone: altPhone, email: altEmail },
        secondContact: { phone, email },
        escalationGuidelines: [
          'Call the after-hours emergency line for time-sensitive issues.',
          'Dispatch supervisor on-call handles all critical escalations after hours.',
          'Do not leave a voicemail for urgent issues — call back immediately.',
        ],
      },
    },
  };
}

// ---- Customers ----
// TODO: Replace MOCK_CUSTOMERS with SharePoint List query results
// TODO: List columns: Id, Title (Name), CustomerType, Role, Bio, Phone, Email
// TODO: Use PnPjs or SPHttpClient to fetch & map to ICustomer[]

export const MOCK_CUSTOMERS: ICustomer[] = [

  // ── Hospitals (2) ────────────────────────────────────────────────────────
  {
    id: '1',
    name: 'Trillium Health Partners',
    customerType: 'Hospital',
    role: 'Transport Coordinator',
    bio: 'Multi-site hospital system serving Mississauga, Brampton, and Georgetown. Major regional provider of acute, emergency, and complex care services in Peel Region.',
    phone: '905-848-7580',
    email: 'transport@thp.ca',
    referral: makeTabContent('Trillium Health Partners', '905-848-7580', '905-848-7600', 'transport@thp.ca', 'dispatch@thp.ca', 'Referral'),
    passenger: makeTabContent('Trillium Health Partners', '905-848-7580', '905-848-7600', 'transport@thp.ca', 'dispatch@thp.ca', 'Passenger'),
    customer: makeTabContent('Trillium Health Partners', '905-848-7580', '905-848-7600', 'transport@thp.ca', 'dispatch@thp.ca', 'Customer'),
  },
  {
    id: '2',
    name: 'ALTUM HEALTH – UHN',
    customerType: 'Hospital',
    role: 'Patient Services Coordinator',
    bio: 'University Health Network–affiliated outpatient rehabilitation and occupational health services provider. Operates clinics across multiple GTA locations including Toronto and Mississauga.',
    phone: '416-597-3422',
    email: 'bookings@altumhealth.com',
    referral: makeTabContent('ALTUM HEALTH', '416-597-3422', '416-597-3499', 'bookings@altumhealth.com', 'admin@altumhealth.com', 'Referral'),
    passenger: makeTabContent('ALTUM HEALTH', '416-597-3422', '416-597-3499', 'bookings@altumhealth.com', 'admin@altumhealth.com', 'Passenger'),
    customer: makeTabContent('ALTUM HEALTH', '416-597-3422', '416-597-3499', 'bookings@altumhealth.com', 'admin@altumhealth.com', 'Customer'),
  },

  // ── Rehabilitation Centres (4) ────────────────────────────────────────────
  {
    id: '3',
    name: "St. John's Rehab",
    customerType: 'Treatment Clinic',
    role: 'Discharge & Transport Coordinator',
    bio: 'Designated rehabilitation hospital within Sunnybrook Health Sciences Centre. Specializes in post-surgical, neurological, cardiac, and complex continuing care rehabilitation.',
    phone: '416-226-6780',
    email: 'rehab.transport@sunnybrook.ca',
    referral: makeTabContent("St. John's Rehab", '416-226-6780', '416-226-6799', 'rehab.transport@sunnybrook.ca', 'discharge@sunnybrook.ca', 'Referral'),
    passenger: makeTabContent("St. John's Rehab", '416-226-6780', '416-226-6799', 'rehab.transport@sunnybrook.ca', 'discharge@sunnybrook.ca', 'Passenger'),
    customer: makeTabContent("St. John's Rehab", '416-226-6780', '416-226-6799', 'rehab.transport@sunnybrook.ca', 'discharge@sunnybrook.ca', 'Customer'),
  },
  {
    id: '4',
    name: 'LifeMark Health',
    customerType: 'Treatment Clinic',
    role: 'Regional Scheduling Lead',
    bio: 'National network of physiotherapy, occupational therapy, and allied health clinics. Ontario locations span the GTA, Hamilton, Ottawa, and London corridors.',
    phone: '905-337-4488',
    email: 'scheduling@lifemark.ca',
    referral: makeTabContent('LifeMark Health', '905-337-4488', '905-337-4400', 'scheduling@lifemark.ca', 'admin@lifemark.ca', 'Referral'),
    passenger: makeTabContent('LifeMark Health', '905-337-4488', '905-337-4400', 'scheduling@lifemark.ca', 'admin@lifemark.ca', 'Passenger'),
    customer: makeTabContent('LifeMark Health', '905-337-4488', '905-337-4400', 'scheduling@lifemark.ca', 'admin@lifemark.ca', 'Customer'),
  },
  {
    id: '5',
    name: 'AGS Rehab Solutions',
    customerType: 'Treatment Clinic',
    role: 'Referral Intake Coordinator',
    bio: 'Community-based rehabilitation services with a focus on vocational rehabilitation, return-to-work programming, and functional abilities assessments.',
    phone: '416-927-7745',
    email: 'referrals@agsrehab.com',
    referral: makeTabContent('AGS Rehab Solutions', '416-927-7745', '416-927-7700', 'referrals@agsrehab.com', 'intake@agsrehab.com', 'Referral'),
    passenger: makeTabContent('AGS Rehab Solutions', '416-927-7745', '416-927-7700', 'referrals@agsrehab.com', 'intake@agsrehab.com', 'Passenger'),
    customer: makeTabContent('AGS Rehab Solutions', '416-927-7745', '416-927-7700', 'referrals@agsrehab.com', 'intake@agsrehab.com', 'Customer'),
  },
  {
    id: '6',
    name: 'Novowell Assessment Centre',
    customerType: 'Treatment Clinic',
    role: 'Clinical Intake Manager',
    bio: 'Multi-disciplinary assessment and rehabilitation centre serving chronic pain, catastrophic injury, and long-term disability cases. Punctuality is critical for all scheduled assessments.',
    phone: '416-481-3990',
    email: 'intake@novowell.com',
    referral: makeTabContent('Novowell', '416-481-3990', '416-481-3900', 'intake@novowell.com', 'admin@novowell.com', 'Referral'),
    passenger: makeTabContent('Novowell', '416-481-3990', '416-481-3900', 'intake@novowell.com', 'admin@novowell.com', 'Passenger'),
    customer: makeTabContent('Novowell', '416-481-3990', '416-481-3900', 'intake@novowell.com', 'admin@novowell.com', 'Customer'),
  },

  // ── IME / Assessment Centres (6) ─────────────────────────────────────────
  {
    id: '7',
    name: 'AssessMed',
    customerType: 'IME Clinic',
    role: 'IME Scheduling Coordinator',
    bio: 'AssessMed has been doing medical examinations since 2002.',
    phone: '905-678-2924',
    email: 'transportation@assessmed.com',
    referral: {
      booking: [
        { title: 'Referral Option', items: ['ASSESSMED MISSISSAUGA'] },
        { title: 'Claim #',         items: ['Regular'] },
        { title: 'Adjuster',        items: ['Regular'] },
        {
          title: 'Return Times',
          items: [
            'DO NOT use duration',
            'Enter return time using :01 or :31 only',
          ],
        },
      ],
      serviceAmendments: {
        'Address Alerts': [
          {
            title: '5945 Airport Rd, Mississauga',
            items: [
              'Book as: ASSESSMED MISSISSAUGA',
              {
                text: 'Approval is required for:',
                subItems: ['New locations', 'Changes to an existing confirmed address'],
              },
              {
                text: 'When approval is required:',
                subItems: [
                  'Email transportation@assessmed.com with the new address',
                  'Wait for written confirmation before dispatching',
                ],
              },
            ],
          },
          {
            title: '120 King St W, Hamilton ON L8P 4V2',
            items: [
              'Book as: ASSESSMED HAMILTON',
              {
                text: 'Approval is required for:',
                subItems: ['New locations', 'Changes to an existing confirmed address'],
              },
              {
                text: 'When approval is required:',
                subItems: [
                  'Email transportation@assessmed.com with the new address',
                  'Wait for written confirmation before dispatching',
                ],
              },
            ],
          },
          {
            title: '4711 Yonge St, North York ON M2N 6K8',
            items: [
              'Book as: ASSESSMED NORTH YORK',
              {
                text: 'Approval is required for:',
                subItems: ['New locations', 'Changes to an existing confirmed address'],
              },
              {
                text: 'When approval is required:',
                subItems: [
                  'Email transportation@assessmed.com with the new address',
                  'Wait for written confirmation before dispatching',
                ],
              },
            ],
          },
        ],
        'Toll Roads (407 / 412)': [{ title: 'Instructions', items: [
          'Toll road usage must be pre-authorized by the account holder.',
          'Default routing avoids 407/412 unless pre-approved in writing.',
        ]}],
        'Wait & Return': [{ title: 'Instructions', items: [
          'Wait & Return trips must be booked as a single round-trip at time of scheduling.',
          'Maximum uncompensated wait time is 2 hours unless pre-approved by dispatch.',
        ]}],
      },
      cancellationsAndChanges: [
        {
          title: 'Change of Address',
          items: [
            {
              text: 'Approval is required for:',
              subItems: [
                'New locations not previously confirmed with AssessMed',
                'Rescheduled appointments with a different address than originally booked',
              ],
            },
            {
              text: 'When approval is required:',
              subItems: [
                'Contact transportation@assessmed.com with the updated address',
                'Include passenger name, appointment date/time, and reason for change',
                'Wait for written confirmation before updating the booking',
              ],
            },
          ],
        },
        {
          title: 'Cancellation Policy',
          items: [
            'Cancellations must be made at least 4 hours before the scheduled pickup.',
            'Late cancellations may be subject to a fee — call 905-678-2924.',
            'Same-day cancellations require verbal confirmation with dispatch.',
          ],
        },
      ],
      reminderCalls: {
        callTiming:       ['72 hours before the scheduled appointment'],
        callAttempts:     ['2 attempts maximum per reminder window'],
        clinicEscalation: ['Send scheduled email to transportation@assessmed.com'],
      },
      contactInformation: {
        businessHours: 'Monday – Friday | 7:30 AM – 5:00 PM EST',
        during: {
          firstContact: {
            phone: '905-678-2924',
            email: 'transportation@assessmed.com',
            phoneNotes: [
              '7:30 AM – 8:00 AM: Ask for Jenn (ext. 1933)',
              '8:00 AM – 5:00 PM: RC Dept',
            ],
          },
          secondContact: {
            phone: '905-678-2924 x1933',
            email: 'transportation@assessmed.com',
          },
          escalationGuidelines: [
            {
              text: 'Dispatch Alerts:',
              subItems: [
                'Email transportation@assessmed.com immediately',
                'Include trip ID, passenger name, and reason for alert',
              ],
            },
          ],
        },
        outside: {
          firstContact: {
            phone: '905-678-2924',
            email: 'transportation@assessmed.com',
            phoneNotes: ['Available Saturdays 6:00 AM – 6:00 PM'],
          },
          secondContact: {
            phone: '416-729-1376',
            email: '',
          },
          escalationGuidelines: [
            'No after-hours dispatch available outside the Saturday window.',
            {
              text: 'For urgent issues:',
              subItems: [
                'Call 416-729-1376',
                'Leave a detailed voicemail if unanswered',
              ],
            },
          ],
        },
      },
    },
    passenger: makeTabContent('AssessMed', '905-678-2924', '416-729-1376', 'transportation@assessmed.com', 'transportation@assessmed.com', 'Passenger'),
    customer:  makeTabContent('AssessMed', '905-678-2924', '416-729-1376', 'transportation@assessmed.com', 'transportation@assessmed.com', 'Customer'),
  },
  {
    id: '8',
    name: 'Benchmark Independent Medical Examinations',
    customerType: 'IME Clinic',
    role: 'Assessment Coordinator',
    bio: 'Specialist IME services across multiple Ontario locations. Strict 48-hour cancellation protocols apply to all bookings without exception.',
    phone: '905-629-8100',
    email: 'booking@benchmarkime.com',
    referral: makeTabContent('Benchmark IME', '905-629-8100', '905-629-8199', 'booking@benchmarkime.com', 'dispatch@benchmarkime.com', 'Referral'),
    passenger: makeTabContent('Benchmark IME', '905-629-8100', '905-629-8199', 'booking@benchmarkime.com', 'dispatch@benchmarkime.com', 'Passenger'),
    customer: makeTabContent('Benchmark IME', '905-629-8100', '905-629-8199', 'booking@benchmarkime.com', 'dispatch@benchmarkime.com', 'Customer'),
  },
  {
    id: '9',
    name: 'CIRA Medical Services',
    customerType: 'IME Clinic',
    role: 'Transport Liaison',
    bio: 'Medical assessment and case management services with multi-site Ontario operations. Precise scheduling coordination required across Toronto, Barrie, and London locations.',
    phone: '416-441-3666',
    email: 'dispatch@cirahealth.ca',
    referral: makeTabContent('CIRA Medical Services', '416-441-3666', '416-441-3600', 'dispatch@cirahealth.ca', 'admin@cirahealth.ca', 'Referral'),
    passenger: makeTabContent('CIRA Medical Services', '416-441-3666', '416-441-3600', 'dispatch@cirahealth.ca', 'admin@cirahealth.ca', 'Passenger'),
    customer: makeTabContent('CIRA Medical Services', '416-441-3666', '416-441-3600', 'dispatch@cirahealth.ca', 'admin@cirahealth.ca', 'Customer'),
  },
  {
    id: '10',
    name: 'National IME Centres Inc',
    customerType: 'IME Clinic',
    role: 'Operations Coordinator',
    bio: 'National IME provider with Ontario offices in Toronto, Ottawa, and Kitchener. All transport requests require 72-hour advance notice — no same-day bookings accepted.',
    phone: '416-979-4633',
    email: 'transport@nationalimecentres.com',
    referral: makeTabContent('National IME Centres', '416-979-4633', '416-979-4600', 'transport@nationalimecentres.com', 'ops@nationalimecentres.com', 'Referral'),
    passenger: makeTabContent('National IME Centres', '416-979-4633', '416-979-4600', 'transport@nationalimecentres.com', 'ops@nationalimecentres.com', 'Passenger'),
    customer: makeTabContent('National IME Centres', '416-979-4633', '416-979-4600', 'transport@nationalimecentres.com', 'ops@nationalimecentres.com', 'Customer'),
  },
  {
    id: '11',
    name: '360 IME',
    customerType: 'IME Clinic',
    role: 'Intake Administrator',
    bio: 'Independent medical examination services primarily serving the insurance and legal sectors. Assessment session timing and claimant punctuality are critical for assessor scheduling.',
    phone: '905-943-6500',
    email: 'admin@360ime.com',
    referral: makeTabContent('360 IME', '905-943-6500', '905-943-6599', 'admin@360ime.com', 'intake@360ime.com', 'Referral'),
    passenger: makeTabContent('360 IME', '905-943-6500', '905-943-6599', 'admin@360ime.com', 'intake@360ime.com', 'Passenger'),
    customer: makeTabContent('360 IME', '905-943-6500', '905-943-6599', 'admin@360ime.com', 'intake@360ime.com', 'Customer'),
  },
  {
    id: '12',
    name: 'Centric Health (VIEWPOINT)',
    customerType: 'IME Clinic',
    role: 'Medical Assessment Coordinator',
    bio: 'Medical assessment services operating under the VIEWPOINT brand. Locations in North York, Toronto, Mississauga, and Barrie. Always confirm VIEWPOINT branding when booking.',
    phone: '416-847-1360',
    email: 'viewpoint.booking@centrichealth.ca',
    referral: makeTabContent('Centric Health (VIEWPOINT)', '416-847-1360', '416-847-1399', 'viewpoint.booking@centrichealth.ca', 'viewpoint.admin@centrichealth.ca', 'Referral'),
    passenger: makeTabContent('Centric Health (VIEWPOINT)', '416-847-1360', '416-847-1399', 'viewpoint.booking@centrichealth.ca', 'viewpoint.admin@centrichealth.ca', 'Passenger'),
    customer: makeTabContent('Centric Health (VIEWPOINT)', '416-847-1360', '416-847-1399', 'viewpoint.booking@centrichealth.ca', 'viewpoint.admin@centrichealth.ca', 'Customer'),
  },

  // ── Disability Management (4) ─────────────────────────────────────────────
  {
    id: '13',
    name: 'D & D Disability Management',
    customerType: 'Social Services',
    role: 'Case Manager',
    bio: 'Vaughan-based disability management and vocational rehabilitation firm. Coordinates transport for IME appointments, treatment sessions, and return-to-work assessments.',
    phone: '905-738-1910',
    email: 'casemgmt@dddisability.com',
    referral: makeTabContent('D & D Disability Management', '905-738-1910', '905-738-1900', 'casemgmt@dddisability.com', 'admin@dddisability.com', 'Referral'),
    passenger: makeTabContent('D & D Disability Management', '905-738-1910', '905-738-1900', 'casemgmt@dddisability.com', 'admin@dddisability.com', 'Passenger'),
    customer: makeTabContent('D & D Disability Management', '905-738-1910', '905-738-1900', 'casemgmt@dddisability.com', 'admin@dddisability.com', 'Customer'),
  },
  {
    id: '14',
    name: 'CIM Catastrophic Injury Management',
    customerType: 'Social Services',
    role: 'Case Coordinator',
    bio: 'Specialized in catastrophic injury (CAT) case management. Claimants frequently require wheelchair-accessible vehicles, stretcher transport, or medical attendant accompaniment.',
    phone: '416-962-2440',
    email: 'transport@ciminc.ca',
    referral: makeTabContent('CIM', '416-962-2440', '416-962-2400', 'transport@ciminc.ca', 'casemgmt@ciminc.ca', 'Referral'),
    passenger: makeTabContent('CIM', '416-962-2440', '416-962-2400', 'transport@ciminc.ca', 'casemgmt@ciminc.ca', 'Passenger'),
    customer: makeTabContent('CIM', '416-962-2440', '416-962-2400', 'transport@ciminc.ca', 'casemgmt@ciminc.ca', 'Customer'),
  },
  {
    id: '15',
    name: 'Vista Disability Management Inc.',
    customerType: 'Social Services',
    role: 'Disability Coordinator',
    bio: 'Full-service disability management and IME coordination firm focused on West GTA clients in Brampton, Mississauga, and Oakville.',
    phone: '905-501-0110',
    email: 'booking@vistadisability.com',
    referral: makeTabContent('Vista Disability', '905-501-0110', '905-501-0199', 'booking@vistadisability.com', 'admin@vistadisability.com', 'Referral'),
    passenger: makeTabContent('Vista Disability', '905-501-0110', '905-501-0199', 'booking@vistadisability.com', 'admin@vistadisability.com', 'Passenger'),
    customer: makeTabContent('Vista Disability', '905-501-0110', '905-501-0199', 'booking@vistadisability.com', 'admin@vistadisability.com', 'Customer'),
  },
  {
    id: '16',
    name: 'Acclaim Ability Management',
    customerType: 'Social Services',
    role: 'Vocational Rehabilitation Consultant',
    bio: 'Disability management and vocational rehabilitation services provider in Toronto. Coordinates transport for claimants attending assessments, treatment, and employment programs.',
    phone: '416-510-3900',
    email: 'referrals@acclaimability.com',
    referral: makeTabContent('Acclaim Ability', '416-510-3900', '416-510-3999', 'referrals@acclaimability.com', 'intake@acclaimability.com', 'Referral'),
    passenger: makeTabContent('Acclaim Ability', '416-510-3900', '416-510-3999', 'referrals@acclaimability.com', 'intake@acclaimability.com', 'Passenger'),
    customer: makeTabContent('Acclaim Ability', '416-510-3900', '416-510-3999', 'referrals@acclaimability.com', 'intake@acclaimability.com', 'Customer'),
  },

  // ── Insurance Companies (2) ───────────────────────────────────────────────
  {
    id: '17',
    name: 'Sun Life Financial Disability',
    customerType: 'Insurance Company',
    role: 'Disability Case Manager',
    bio: 'Group benefits division of Sun Life Financial coordinating medical transport for long-term disability claimants. All trips require a valid claim reference number at time of booking.',
    phone: '416-408-7105',
    email: 'disability.transport@sunlife.com',
    referral: makeTabContent('Sun Life', '416-408-7105', '416-408-7100', 'disability.transport@sunlife.com', 'claims@sunlife.com', 'Referral'),
    passenger: makeTabContent('Sun Life', '416-408-7105', '416-408-7100', 'disability.transport@sunlife.com', 'claims@sunlife.com', 'Passenger'),
    customer: makeTabContent('Sun Life', '416-408-7105', '416-408-7100', 'disability.transport@sunlife.com', 'claims@sunlife.com', 'Customer'),
  },
  {
    id: '18',
    name: 'Crawford & Company',
    customerType: 'Insurance Company',
    role: 'Claims Transport Coordinator',
    bio: 'International insurance claims management company. Canadian operations manage transport for WSIB, auto, and liability claims. Claim number must be provided with every booking.',
    phone: '416-367-1555',
    email: 'claims.transport@crawco.ca',
    referral: makeTabContent('Crawford & Company', '416-367-1555', '416-367-1500', 'claims.transport@crawco.ca', 'admin@crawco.ca', 'Referral'),
    passenger: makeTabContent('Crawford & Company', '416-367-1555', '416-367-1500', 'claims.transport@crawco.ca', 'admin@crawco.ca', 'Passenger'),
    customer: makeTabContent('Crawford & Company', '416-367-1555', '416-367-1500', 'claims.transport@crawco.ca', 'admin@crawco.ca', 'Customer'),
  },

  // ── Government Agency (1) ─────────────────────────────────────────────────
  {
    id: '19',
    name: 'WSIB Ontario',
    customerType: 'Insurance Company',
    role: 'Transport Authorization Specialist',
    bio: "Ontario's Workplace Safety and Insurance Board. All transport trips must reference a valid WSIB claim number. Prior authorization required for every booking — no exceptions.",
    phone: '416-344-1000',
    email: 'transport.services@wsib.on.ca',
    referral: makeTabContent('WSIB', '416-344-1000', '416-344-4500', 'transport.services@wsib.on.ca', 'claims@wsib.on.ca', 'Referral'),
    passenger: makeTabContent('WSIB', '416-344-1000', '416-344-4500', 'transport.services@wsib.on.ca', 'claims@wsib.on.ca', 'Passenger'),
    customer: makeTabContent('WSIB', '416-344-1000', '416-344-4500', 'transport.services@wsib.on.ca', 'claims@wsib.on.ca', 'Customer'),
  },

  // ── Law Firm (1) ──────────────────────────────────────────────────────────
  {
    id: '20',
    name: 'Oatley Vigmond Personal Injury Lawyers',
    customerType: 'Lawyer',
    role: 'Legal Transport Coordinator',
    bio: 'Barrie-based personal injury law firm. Arranges expert transport for clients attending IME assessments and medical appointments as part of active litigation or settlement proceedings.',
    phone: '705-726-9021',
    email: 'admin@oatleyvigmond.com',
    referral: makeTabContent('Oatley Vigmond', '705-726-9021', '705-726-9099', 'admin@oatleyvigmond.com', 'legal@oatleyvigmond.com', 'Referral'),
    passenger: makeTabContent('Oatley Vigmond', '705-726-9021', '705-726-9099', 'admin@oatleyvigmond.com', 'legal@oatleyvigmond.com', 'Passenger'),
    customer: makeTabContent('Oatley Vigmond', '705-726-9021', '705-726-9099', 'admin@oatleyvigmond.com', 'legal@oatleyvigmond.com', 'Customer'),
  },
];
