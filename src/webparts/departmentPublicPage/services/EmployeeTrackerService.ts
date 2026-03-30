import { getSP } from './spConfig';
import { ET } from './fieldNames';
import { getDepartmentMatchNames } from './DepartmentConfig';

export interface IDepartmentLeader {
  id: number;
  name: string;
  level: string;
  shift?: string;
  phone?: string;
  photoUrl?: string;
}

interface ICacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const leadersCache: Map<string, ICacheEntry<IDepartmentLeader[]>> = new Map();

function isFresh<T>(entry: ICacheEntry<T> | undefined): entry is ICacheEntry<T> {
  return !!entry && Date.now() - entry.timestamp < CACHE_TTL_MS;
}

/** Base URL for list item attachments (modern Image column stores files here). */
const ATTACHMENTS_BASE =
  'https://rapidcitytransport.sharepoint.com/sites/Management/Lists/Employee%20Tracker/Attachments';

/**
 * Fetches department leaders from the Employee Tracker list.
 *
 * Logic: returns active employees whose "Department(s)" multi-value choice
 * contains BOTH "Management" AND the given department display name
 * (e.g. "Customer Experience").
 *
 * Because SharePoint REST API cannot filter on multi-value choice columns
 * server-side, we fetch all active employees and filter client-side.
 */
export async function fetchDepartmentLeaders(
  departmentDisplayName: string,
  forceRefresh = false
): Promise<IDepartmentLeader[]> {
  const cacheKey = departmentDisplayName.toLowerCase();

  if (!forceRefresh) {
    const cached = leadersCache.get(cacheKey);
    if (isFresh(cached)) return cached.data;
  }

  const sp = getSP();

  // "Staff" is a lookup/person column — SharePoint requires $expand + sub-select
  const rawItems: Record<string, unknown>[] = await sp.web.lists
    .getByTitle(ET.LIST_TITLE)
    .items.select(
      ET.Id,
      ET.StaffExpand,   // selects "Staff/Title" → the person's display name
      ET.Active,
      ET.WorkingStatus,
      ET.Departments,
      ET.Level,
      ET.Shift,
      ET.PhoneLine,
      ET.Photo
    )
    .expand(ET.Staff)   // tells SharePoint to load the Staff lookup data
    .top(5000)();

  const leaders: IDepartmentLeader[] = [];

  for (const raw of rawItems) {
    // Check active status — could be boolean or string depending on column type
    const active = raw[ET.Active];
    if (active !== true && active !== 'Yes') continue;

    // Parse "Department(s)" — multi-value choice returns [...] array
    const deptRaw = raw[ET.Departments];
    let departments: string[] = [];
    if (Array.isArray(deptRaw)) {
      departments = deptRaw as string[];
    } else if (
      deptRaw &&
      typeof deptRaw === 'object' &&
      'results' in (deptRaw as Record<string, unknown>)
    ) {
      departments = (deptRaw as { results: string[] }).results;
    } else if (typeof deptRaw === 'string') {
      departments = [deptRaw];
    }

    const deptLower = departments.map(d => d.toLowerCase());

    // Must have "Management" AND the target department (or any of its aliases)
    const hasManagement = deptLower.some(d => d === 'management');
    const matchNames = getDepartmentMatchNames(departmentDisplayName).map(n => n.toLowerCase());
    const hasDept = deptLower.some(d => matchNames.indexOf(d) !== -1);

    if (!hasManagement || !hasDept) continue;

    // Staff is a lookup — the name is nested: { Staff: { Title: "..." } }
    const staffObj = raw[ET.Staff] as { Title?: string } | undefined;
    const staffName = staffObj?.Title || '';

    // Photo — modern Image column returns JSON with fileName.
    // The actual image is stored as a list item attachment.
    const itemId = raw[ET.Id] as number;
    let photoUrl: string | undefined;
    const photoRaw = raw[ET.Photo];
    if (typeof photoRaw === 'string' && photoRaw) {
      try {
        const parsed = JSON.parse(photoRaw);
        if (parsed.fileName) {
          photoUrl = `${ATTACHMENTS_BASE}/${itemId}/${encodeURIComponent(parsed.fileName)}`;
        }
      } catch {
        // Not JSON — treat as plain URL if it looks like one
        if (photoRaw.startsWith('http') || photoRaw.startsWith('/')) {
          photoUrl = photoRaw;
        }
      }
    }

    // Use the department display name (e.g. "Customer Experience") as the role
    leaders.push({
      id: itemId,
      name: staffName,
      level: departmentDisplayName,
      shift: (raw[ET.Shift] as string) || undefined,
      phone: (raw[ET.PhoneLine] as string) || undefined,
      photoUrl,
    });
  }

  // Sort alphabetically by name
  leaders.sort((a, b) => a.name.localeCompare(b.name));

  leadersCache.set(cacheKey, { data: leaders, timestamp: Date.now() });
  return leaders;
}
