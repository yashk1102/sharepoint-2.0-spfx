// ============================================================
// PnPjs SPFI factory — initialized once per web part lifecycle
// ============================================================
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { spfi, SPFI, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

let _sp: SPFI | undefined;

/** SharePoint site that hosts the Protocol Book lists. */
const PROTOCOL_BOOK_SITE_URL =
  'https://rapidcitytransport.sharepoint.com/sites/IntranetRedesignSharepoint20';

/**
 * Call once from the web part's `onInit()`.
 * Components then import `getSP()` to access the configured instance.
 */
export function initializeSP(context: WebPartContext): SPFI {
  _sp = spfi(PROTOCOL_BOOK_SITE_URL).using(SPFx(context));
  return _sp;
}

/**
 * Returns the SPFI instance. Throws if `initializeSP` hasn't been called.
 */
export function getSP(): SPFI {
  if (!_sp) {
    throw new Error(
      'PnPjs SPFI not initialized. Call initializeSP(context) in the web part onInit().'
    );
  }
  return _sp;
}
