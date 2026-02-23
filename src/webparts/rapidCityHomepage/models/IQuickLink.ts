/**
 * Quick link item: label, url, and optional Fluent icon name for the tile.
 */
export interface IQuickLink {
  label: string;
  url: string;
  /** Optional: Fluent UI icon name (e.g. 'People', 'Contact', 'Mail') for the tile. */
  iconName?: string;
}
