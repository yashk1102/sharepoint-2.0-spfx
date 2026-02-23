import { DisplayMode } from '@microsoft/sp-core-library';
import { IQuickLink } from '../models/IQuickLink';

export interface IRapidCityHomepageProps {
  quickLinks: IQuickLink[];
  contactCardsPageUrl: string;
  feedbackUrl: string;
  displayMode: DisplayMode;
}
