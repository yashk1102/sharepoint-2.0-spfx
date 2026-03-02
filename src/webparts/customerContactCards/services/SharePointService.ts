// ============================================================
// SharePointService — read-only queries for Protocol Book data
// ============================================================
import { getSP } from './spConfig';
import { PB, IB, IB_SELECT_FIELDS, ALL_LOOKUP_COLUMNS } from './fieldNames';
import {
  IProtocolBookGridItem,
  IProtocolBookDetailItem,
  IInstructionBlockRaw,
} from '../models/IProtocolBookItem';

// ---- In-memory cache ----
interface ICacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const gridCache: { entry?: ICacheEntry<IProtocolBookGridItem[]> } = {};
const detailCache: Map<number, ICacheEntry<IProtocolBookDetailItem>> = new Map();

function isFresh<T>(entry: ICacheEntry<T> | undefined): entry is ICacheEntry<T> {
  return !!entry && Date.now() - entry.timestamp < CACHE_TTL_MS;
}

// ---- Public API ----

/**
 * Fetch lightweight client list for the card grid.
 * No lookup expansion — only flat fields needed for cards.
 */
export async function fetchGridItems(
  forceRefresh = false
): Promise<IProtocolBookGridItem[]> {
  if (!forceRefresh && isFresh(gridCache.entry)) {
    return gridCache.entry.data;
  }

  const sp = getSP();

  const rawItems = await sp.web.lists
    .getByTitle(PB.LIST_TITLE)
    .items.select(
      PB.Id,
      PB.Title,
      PB.ClientName,
      PB.ClientRole,
      PB.ClientType,
      PB.PhoneBusinessHours,
      PB.Specification
    )
    .top(5000)();

  // Map raw SP response to typed interface
  const items: IProtocolBookGridItem[] = rawItems.map((raw: Record<string, unknown>) => ({
    Id: raw[PB.Id] as number,
    Title: (raw[PB.Title] as string) || '',
    ClientName: (raw[PB.ClientName] as string) || undefined,
    ClientRole: (raw[PB.ClientRole] as string) || undefined,
    ClientType: (raw[PB.ClientType] as string) || undefined,
    PhoneBusinessHours: (raw[PB.PhoneBusinessHours] as string) || undefined,
    Specification: (raw[PB.Specification] as string) || undefined,
  }));

  gridCache.entry = { data: items, timestamp: Date.now() };
  return items;
}

/**
 * Fetch a single client by ID with full instruction-block data.
 *
 * Two-phase approach (avoids $expand which can't project Note fields):
 *   1. Fetch the Protocol Book item with flat fields + lookup ID fields
 *   2. Fetch referenced instruction blocks directly from their list
 */
export async function fetchDetailItem(
  id: number,
  forceRefresh = false
): Promise<IProtocolBookDetailItem> {
  if (!forceRefresh) {
    const cached = detailCache.get(id);
    if (isFresh(cached)) {
      return cached.data;
    }
  }

  const sp = getSP();

  // --- Phase 1: Protocol Book item (flat fields + lookup IDs, no $expand) ---

  const flatFields = [
    PB.Id, PB.Title, PB.ClientName, PB.ClientRole, PB.ClientType,
    PB.Specification, PB.PhoneBusinessHours, PB.PhoneAfterHours,
    PB.SpecialInstructions, PB.AccountNumber, PB.Customer,
    PB.ReferralOptions, PB.PassengerNotes, PB.TripNotes,
    PB.UnitInfo, PB.ProblemWithReminderCall,
    PB.ApprovalAllModifications, PB.ApprovalBlanket,
    PB.ApprovalRTW, PB.ApprovalNotes,
  ];

  // For each lookup column "Foo", SharePoint exposes "FooId" containing the
  // numeric ID(s) of the referenced item(s).
  const lookupIdFields = ALL_LOOKUP_COLUMNS.map(col => `${col}Id`);

  const raw: Record<string, unknown> = await sp.web.lists
    .getByTitle(PB.LIST_TITLE)
    .items.getById(id)
    .select(...flatFields, ...lookupIdFields)();

  // --- Phase 2: Fetch referenced instruction blocks by ID ---

  const allBlockIds = new Set<number>();
  for (const col of ALL_LOOKUP_COLUMNS) {
    const val = raw[`${col}Id`];
    if (Array.isArray(val)) {
      for (const v of val) if (typeof v === 'number') allBlockIds.add(v);
    } else if (typeof val === 'number') {
      allBlockIds.add(val);
    }
  }

  const blocksById = new Map<number, IInstructionBlockRaw>();

  if (allBlockIds.size > 0) {
    const idArray: number[] = [];
    allBlockIds.forEach(bid => idArray.push(bid));
    const filter = idArray.map(bid => `(Id eq ${bid})`).join(' or ');

    const ibRaw: Record<string, unknown>[] = await sp.web.lists
      .getByTitle(IB.LIST_TITLE)
      .items.select(...IB_SELECT_FIELDS)
      .filter(filter)
      .top(allBlockIds.size)();

    for (const row of ibRaw) {
      const block: IInstructionBlockRaw = {
        Id: row[IB.Id] as number,
        Title: (row[IB.Title] as string) || '',
        Category: (row[IB.Category] as string) || undefined,
        Source: (row[IB.Source] as string) || undefined,
        DefaultText: (row[IB.DefaultText] as string) || undefined,
        Description: (row[IB.Description] as string) || undefined,
        ApprovalToModify: (row[IB.ApprovalToModify] as string) || undefined,
      };
      blocksById.set(block.Id, block);
    }
  }

  // --- Build the detail item ---

  const item = mapRawToDetail(raw, blocksById);

  detailCache.set(id, { data: item, timestamp: Date.now() });
  return item;
}

/** Invalidate all caches (e.g., if the user triggers a manual refresh). */
export function clearCache(): void {
  gridCache.entry = undefined;
  detailCache.clear();
}

// ---- Internal helpers ----

/** Resolve a single-value lookup ID to a full instruction block. */
function resolveBlock(
  raw: Record<string, unknown>,
  col: string,
  blocksById: Map<number, IInstructionBlockRaw>
): IInstructionBlockRaw | null {
  const val = raw[`${col}Id`];
  if (typeof val === 'number') return blocksById.get(val) || null;
  return null;
}

/** Resolve a multi-value lookup ID array to instruction blocks. */
function resolveBlocks(
  raw: Record<string, unknown>,
  col: string,
  blocksById: Map<number, IInstructionBlockRaw>
): IInstructionBlockRaw[] {
  const val = raw[`${col}Id`];
  if (Array.isArray(val)) {
    return val
      .map(v => (typeof v === 'number' ? blocksById.get(v) : undefined))
      .filter(Boolean) as IInstructionBlockRaw[];
  }
  // Single-value lookup treated as array
  const single = resolveBlock(raw, col, blocksById);
  return single ? [single] : [];
}

function mapRawToDetail(
  raw: Record<string, unknown>,
  blocksById: Map<number, IInstructionBlockRaw>
): IProtocolBookDetailItem {
  return {
    // Flat fields
    Id: raw[PB.Id] as number,
    Title: (raw[PB.Title] as string) || '',
    ClientName: (raw[PB.ClientName] as string) || undefined,
    ClientRole: (raw[PB.ClientRole] as string) || undefined,
    ClientType: (raw[PB.ClientType] as string) || undefined,
    Specification: (raw[PB.Specification] as string) || undefined,
    PhoneBusinessHours: (raw[PB.PhoneBusinessHours] as string) || undefined,
    PhoneAfterHours: (raw[PB.PhoneAfterHours] as string) || undefined,
    SpecialInstructions: (raw[PB.SpecialInstructions] as string) || undefined,
    AccountNumber: (raw[PB.AccountNumber] as string) || undefined,
    Customer: (raw[PB.Customer] as string) || undefined,
    ReferralOptions: (raw[PB.ReferralOptions] as string) || undefined,
    PassengerNotes: (raw[PB.PassengerNotes] as string) || undefined,
    TripNotes: (raw[PB.TripNotes] as string) || undefined,
    UnitInfo: (raw[PB.UnitInfo] as string) || undefined,
    ProblemWithReminderCall: (raw[PB.ProblemWithReminderCall] as string) || undefined,
    ApprovalAllModifications: (raw[PB.ApprovalAllModifications] as string) || undefined,
    ApprovalBlanket: (raw[PB.ApprovalBlanket] as string) || undefined,
    ApprovalRTW: (raw[PB.ApprovalRTW] as string) || undefined,
    ApprovalNotes: (raw[PB.ApprovalNotes] as string) || undefined,

    // Single-value lookups
    WaitTimes: resolveBlock(raw, PB.WaitTimes, blocksById),
    ReturnTimesPolicy: resolveBlock(raw, PB.ReturnTimesPolicy, blocksById),
    ApptType: resolveBlock(raw, PB.ApptType, blocksById),

    // Multi-value lookups
    ConfirmationCall: resolveBlocks(raw, PB.ConfirmationCall, blocksById),
    ServiceType: resolveBlocks(raw, PB.ServiceType, blocksById),
    VehicleTypePolicy: resolveBlocks(raw, PB.VehicleTypePolicy, blocksById),
    ChangePolicy: resolveBlocks(raw, PB.ChangePolicy, blocksById),
    CancelPolicy: resolveBlocks(raw, PB.CancelPolicy, blocksById),
  };
}
