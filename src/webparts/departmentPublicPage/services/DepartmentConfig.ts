/**
 * Department configuration map for public department pages.
 *
 * Each department key maps to display-name, contact info, resource-hub URL,
 * and an Azure AD group GUID whose members see the "View Department Resources"
 * button.  Property-pane overrides take precedence over these defaults.
 *
 * Replace the placeholder groupId GUIDs with real Azure AD / M365 group IDs
 * once the groups are provisioned.
 */

export type DepartmentKey =
  | 'customerExperience'
  | 'dispatch'
  | 'accounting'
  | 'humanResources'
  | 'informationTechnology'
  | 'businessDevelopment';

export interface IDepartmentConfig {
  key: DepartmentKey;
  displayName: string;
  subtitle: string;
  contactEmail: string;
  contactPhone: string;
  contactHours: string;
  /** URL to the locked-down department hub page (only for authorized members). */
  resourcePageUrl: string;
  /** Azure AD / M365 group GUID — members of this group see the CTA button. */
  groupId: string;
}

export const DEPARTMENT_CONFIGS: Record<DepartmentKey, IDepartmentConfig> = {
  customerExperience: {
    key: 'customerExperience',
    displayName: 'Customer Experience',
    subtitle: 'About the Team',
    contactEmail: 'CustomerExperience@rapidcitytransport.com',
    contactPhone: '605-394-4175',
    contactHours: '8:00 AM - 5:00 PM',
    resourcePageUrl: '/SitePages/DeptHub-Customer-Experience.aspx',
    groupId: '00000000-0000-0000-0000-000000000001', // Replace with real GUID
  },
  dispatch: {
    key: 'dispatch',
    displayName: 'Dispatch',
    subtitle: 'About the Team',
    contactEmail: 'dispatch@rapidcitytransport.com',
    contactPhone: '605-394-4176',
    contactHours: '24/7',
    resourcePageUrl: '/SitePages/DeptHub-Dispatch.aspx',
    groupId: '00000000-0000-0000-0000-000000000002', // Replace with real GUID
  },
  accounting: {
    key: 'accounting',
    displayName: 'Accounting',
    subtitle: 'About the Team',
    contactEmail: 'accounting@rapidcitytransport.com',
    contactPhone: '605-394-4177',
    contactHours: '8:00 AM - 5:00 PM',
    resourcePageUrl: '/SitePages/DeptHub-Accounting.aspx',
    groupId: '00000000-0000-0000-0000-000000000003', // Replace with real GUID
  },
  humanResources: {
    key: 'humanResources',
    displayName: 'Human Resources',
    subtitle: 'About the Team',
    contactEmail: 'hr@rapidcitytransport.com',
    contactPhone: '605-394-4178',
    contactHours: '8:00 AM - 5:00 PM',
    resourcePageUrl: '/SitePages/DeptHub-Human-Resources.aspx',
    groupId: '00000000-0000-0000-0000-000000000004', // Replace with real GUID
  },
  informationTechnology: {
    key: 'informationTechnology',
    displayName: 'Information Technology',
    subtitle: 'About the Team',
    contactEmail: 'support@rapidcitytransport.com',
    contactPhone: '605-394-4179',
    contactHours: '8:00 AM - 5:00 PM',
    resourcePageUrl: '/SitePages/DeptHub-Information-Technology.aspx',
    groupId: '00000000-0000-0000-0000-000000000005', // Replace with real GUID
  },
  businessDevelopment: {
    key: 'businessDevelopment',
    displayName: 'Business Development',
    subtitle: 'About the Team',
    contactEmail: 'bizdev@rapidcitytransport.com',
    contactPhone: '605-394-4180',
    contactHours: '8:00 AM - 5:00 PM',
    resourcePageUrl: '/SitePages/DeptHub-Business-Development.aspx',
    groupId: '00000000-0000-0000-0000-000000000006', // Replace with real GUID
  },
};

/**
 * Maps display names to alternate names used in the Employee Tracker list.
 * The filter will match if the employee's department matches ANY of these names.
 */
export const DEPARTMENT_ALIASES: Record<string, string[]> = {
  'Human Resources': ['Human Resources', 'HR'],
  'Information Technology': ['Information Technology', 'IT'],
};

/** Returns all names that should match for a given department display name. */
export function getDepartmentMatchNames(displayName: string): string[] {
  return DEPARTMENT_ALIASES[displayName] || [displayName];
}

/** Returns the config for a department key, or undefined if the key is unknown. */
export function getDepartmentConfig(key: string): IDepartmentConfig | undefined {
  return DEPARTMENT_CONFIGS[key as DepartmentKey];
}

/** All department keys — used for the property pane dropdown. */
export const ALL_DEPARTMENT_KEYS: DepartmentKey[] = [
  'customerExperience',
  'dispatch',
  'accounting',
  'humanResources',
  'informationTechnology',
  'businessDevelopment',
];
