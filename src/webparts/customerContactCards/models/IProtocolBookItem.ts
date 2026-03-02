// ============================================================
// Raw SharePoint item interfaces — mirror the SP list schema
// ============================================================

/**
 * Instruction block fields returned when a lookup column is expanded.
 * Mirrors the "PB Instruction Blocks Test" list.
 */
export interface IInstructionBlockRaw {
  Id: number;
  Title: string;
  Category?: string;       // e.g., "Service Type", "Cancellations", "Changes"
  Source?: string;          // "Client" | "Passenger" | "Customer"
  DefaultText?: string;     // Multiline plain text — the main instruction content
  Description?: string;     // Multiline plain text — additional context
  ApprovalToModify?: string; // e.g., "Proceed", "Needs Approval"
}

/**
 * Lightweight Protocol Book item — grid page (no lookup expansion).
 */
export interface IProtocolBookGridItem {
  Id: number;
  Title: string;
  ClientName?: string;
  ClientRole?: string;
  ClientType?: string;
  PhoneBusinessHours?: string;
  Specification?: string;
}

/**
 * Full Protocol Book item — detail page (all lookups expanded).
 * Lookup fields come back as single objects or arrays depending on
 * whether the SP column allows multiple values.
 */
export interface IProtocolBookDetailItem extends IProtocolBookGridItem {
  PhoneAfterHours?: string;
  SpecialInstructions?: string;
  AccountNumber?: string;
  Customer?: string;
  ReferralOptions?: string;
  PassengerNotes?: string;
  TripNotes?: string;
  UnitInfo?: string;
  ProblemWithReminderCall?: string;

  // Approval fields
  ApprovalAllModifications?: string;
  ApprovalBlanket?: string;
  ApprovalRTW?: string;
  ApprovalNotes?: string;

  // ---- Expanded lookup fields ----
  // Single-value lookups → object | null
  WaitTimes?: IInstructionBlockRaw | null;
  ReturnTimesPolicy?: IInstructionBlockRaw | null;
  ApptType?: IInstructionBlockRaw | null;

  // Multi-value lookups → array
  ConfirmationCall?: IInstructionBlockRaw[];
  ServiceType?: IInstructionBlockRaw[];
  VehicleTypePolicy?: IInstructionBlockRaw[];
  ChangePolicy?: IInstructionBlockRaw[];
  CancelPolicy?: IInstructionBlockRaw[];
}

/**
 * All possible "Source" values on an instruction block.
 * Maps to the 3 context tabs in the UI.
 */
export type InstructionSource = 'Client' | 'Passenger' | 'Customer';
