// ============================================================
// SharePoint Column Internal Names — Central Configuration
// ============================================================
//
// IMPORTANT: These names are *assumed* based on the display names visible
// in the SharePoint list UI. If a query fails with "field not found",
// verify the actual internal names by running this REST call in the browser:
//
//   /_api/web/lists/getByTitle('Protocol Book Draft2')/fields
//       ?$select=Title,InternalName,TypeAsString
//       &$filter=Hidden eq false
//       &$orderby=Title
//
// Then update the constants below to match.
// ============================================================

// ---- Protocol Book Draft2 — flat fields ----
export const PB = {
  LIST_TITLE: 'Protocol Book Draft2',

  // Core identification
  Id: 'Id',
  Title: 'Title',                                                     // "AGS Rehab Solutions Inc as a Referral"
  ClientName: 'Client_x0020_Name',                                    // "AGS Rehab Solutions Inc"
  ClientRole: 'Client_x0020_Role',                                    // Choice: "Referral", etc.
  ClientType: 'ClientType',                                           // Choice: "IME Clinic", "Hospital", etc.
  Specification: 'Specification',                                      // Note — bio / description

  // Contact info
  PhoneBusinessHours: 'Phone_x0020_Numbers_x0020__x00280',            // Note — "Phone Numbers (Business Hours)"
  PhoneAfterHours: 'Phone_x0020_Numbers_x0020__x0028',                // Note — "Phone Numbers (After Hours)"
  SpecialInstructions: 'Special_x0020_Instructions',                   // Note
  AccountNumber: 'Account_x0020_Number',                               // Text
  Customer: 'Customer',                                                // Note
  ReferralOptions: 'Referral_x0020_Options',                           // Note

  // Additional notes
  PassengerNotes: 'PassengerNotes',                                    // Note — "Passenger Notes"
  TripNotes: 'Trip_x0020_Notes',                                      // Note
  UnitInfo: 'Unit_x0020_Info',                                        // Note
  ProblemWithReminderCall: 'Problem_x0020_With_x0020_Reminde',         // Note — "Problem With Reminder Call"

  // ---- Lookup columns (references to PB Instruction Blocks Test) ----
  // Single-value lookups
  WaitTimes: 'WaitTimes',                                             // Lookup — "Wait Times (Lookup)"
  ReturnTimesPolicy: 'Return_x0020_Times_x0020_Policy',               // Lookup — "Return Times Policy (Lookup)"
  ApptType: 'Appt_x0020_Type',                                        // Lookup — "Appt Type"

  // Multi-value lookups
  ConfirmationCall: 'ConfirmationCall',                                // LookupMulti — "Confirmation Call (Lookup)"
  Confirmations: 'Confirmations_x0028_Lookup_x0029',                  // LookupMulti — "Confirmations (Lookup)"
  ServiceType: 'Service_x0020_Type_x0020__x0028_',                    // LookupMulti — "Service Type (Lookup)"
  VehicleTypePolicy: 'Vehicle_x0020_Type_x0020_Policy',               // LookupMulti — "Vehicle Type Policy (Lookup)"
  ChangePolicy: 'Cancel_x0020__x0026__x0020_Chang',                   // LookupMulti — "Change Policy (Lookup)"
  CancelPolicy: 'Cancel_x0020_Policy_x0020__x0028',                   // LookupMulti — "Cancel Policy (lookup)"

  // Approval fields (read-only display)
  ApprovalAllModifications: 'Approval_x0020__x002d__x0020_ALL',       // Note — "Approval - ALL MED&RTW"
  ApprovalBlanket: 'Approval_x0020__x002d__x0020_Bla',                // Note — "Approval - Blanket"
  ApprovalRTW: 'Approval_x0020__x002d__x0020_RTW',                    // Note — "Approval - RTW"
  ApprovalNotes: 'Approval_x0020_Notes_x0020__x002',                  // Note — "Approval Notes - SIP"
} as const;

// ---- PB Instruction Blocks Test — queried directly (not via lookup expansion) ----
export const IB = {
  LIST_TITLE: 'PB Instruction Blocks Test',

  Id: 'Id',
  Title: 'Title',
  Category: 'Category',                       // Choice
  ClientType: 'ClientType',                    // Choice — "Client Type"
  Source: 'Source',                             // Choice — "Client" | "Passenger" | "Customer"
  DefaultText: 'DefaultText',                  // Note — "Default Text"
  Description: 'Description',                  // Note
  ApprovalToModify: 'Approval',                // Choice — "Approval to Modify"
} as const;

// All IB fields to $select when fetching instruction blocks
export const IB_SELECT_FIELDS = [
  IB.Id, IB.Title, IB.Category, IB.ClientType,
  IB.Source, IB.DefaultText, IB.Description, IB.ApprovalToModify,
] as const;

// All Protocol Book lookup columns that reference instruction blocks.
// Used to build "{col}Id" selects on the Protocol Book item.
export const ALL_LOOKUP_COLUMNS = [
  PB.ConfirmationCall,
  PB.WaitTimes,
  PB.ReturnTimesPolicy,
  PB.ApptType,
  PB.ServiceType,
  PB.VehicleTypePolicy,
  PB.ChangePolicy,
  PB.CancelPolicy,
] as const;
