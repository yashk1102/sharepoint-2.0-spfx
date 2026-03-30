export interface IInstructionBlockRaw {
  Id: number;
  Title: string;
  Category?: string;
  Source?: string;
  DefaultText?: string;
  Description?: string;
  ApprovalToModify?: string;
}

export interface IProtocolBookGridItem {
  Id: number;
  Title: string;
  ClientName?: string;
  ClientRole?: string;
  ClientType?: string;
  PhoneBusinessHours?: string;
  Specification?: string;
}

export interface IProtocolBookDetailItem extends IProtocolBookGridItem {
  PhoneAfterHours?: string;
  SpecialInstructions?: string;
  AccountNumber?: string;
  Customer?: string;
  ReferralOptions?: string;
  PassengerName?: string;
  PassengerNotes?: string;
  TripNotes?: string;
  UnitInfo?: string;
  ProblemWithReminderCall?: string;
  OkToBill3rdParty?: string;
  ConfirmationsSpecific?: string;

  ApprovalAllModifications?: string;
  ApprovalBlanket?: string;
  ApprovalRTW?: string;
  ApprovalNotes?: string;

  // Single-value lookups
  WaitTimes?: IInstructionBlockRaw | null;
  ReturnTimesPolicy?: IInstructionBlockRaw | null;
  ApptType?: IInstructionBlockRaw | null;

  // Multi-value lookups
  ConfirmationCall?: IInstructionBlockRaw[];
  Confirmations?: IInstructionBlockRaw[];
  ServiceType?: IInstructionBlockRaw[];
  ServiceAmendments?: IInstructionBlockRaw[];
  VehicleTypePolicy?: IInstructionBlockRaw[];
  ChangePolicy?: IInstructionBlockRaw[];
  CancelPolicy?: IInstructionBlockRaw[];
}

export type InstructionSource = 'Client' | 'Passenger' | 'Customer';
