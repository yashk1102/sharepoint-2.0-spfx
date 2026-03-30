import { WebPartContext } from '@microsoft/sp-webpart-base';
import { spfi, SPFI, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';

let _sp: SPFI | undefined;

const MANAGEMENT_SITE_URL =
  'https://rapidcitytransport.sharepoint.com/sites/Management';

/** Call once from the web part's onInit(). */
export function initializeSP(context: WebPartContext): SPFI {
  _sp = spfi(MANAGEMENT_SITE_URL).using(SPFx(context));
  return _sp;
}

/** Get the initialized SPFI instance (Management site). */
export function getSP(): SPFI {
  if (!_sp) {
    throw new Error(
      'PnPjs SPFI not initialized. Call initializeSP(context) in onInit().'
    );
  }
  return _sp;
}
