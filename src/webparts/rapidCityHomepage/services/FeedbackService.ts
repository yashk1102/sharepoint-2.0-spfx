import { getSP } from '../../customerContactCards/services/spConfig';

/**
 * SharePoint list name where feedback is stored.
 * Create this list on the site with columns:
 *   Title          (Single line — auto-mapped to PageIdentifier)
 *   Description    (Multiple lines of text, plain text)
 *   Urgency        (Choice: Critical, High, Medium, Low)
 */
const FEEDBACK_LIST_TITLE = 'SiteFeedback';

export interface IFeedbackPayload {
  pageIdentifier: string;
  description: string;
  urgency: string;
}

/**
 * Submits feedback to the SiteFeedback SharePoint list.
 * Uses the PnPjs SPFI instance already initialized by the web part.
 */
export async function submitFeedback(payload: IFeedbackPayload): Promise<void> {
  const sp = getSP();
  await sp.web.lists.getByTitle(FEEDBACK_LIST_TITLE).items.add({
    Title: payload.pageIdentifier,
    Description: payload.description,
    Urgency: payload.urgency,
  });
}
