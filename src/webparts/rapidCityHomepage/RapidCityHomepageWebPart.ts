import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { type IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IQuickLink } from './models/IQuickLink';
import RapidCityHomepage from './components/RapidCityHomepage';
import { IRapidCityHomepageProps } from './components/IRapidCityHomepageProps';

export interface IRapidCityHomepageWebPartProps {
  /** JSON array of { label, url, iconName? } for quick links. */
  quickLinksJson: string;
  /** Contact Cards page URL for search redirect (e.g. /sites/intranet/SitePages/ContactCards.aspx). Update to real intranet link. */
  contactCardsPageUrl: string;
  /** Send Feedback link URL. Update to real feedback form/list. */
  feedbackUrl: string;
}

const DEFAULT_QUICK_LINKS: IQuickLink[] = [
  { label: 'Employee Directory', url: '#', iconName: 'People' },
  { label: 'Contact Cards', url: '#', iconName: 'Contact' },
  { label: 'ADP', url: '#', iconName: 'Org' },
  { label: 'Teams', url: '#', iconName: 'TeamsLogo' },
  { label: 'Outlook', url: '#', iconName: 'Mail' },
  { label: 'Five9', url: '#', iconName: 'Phone' },
  { label: 'RISE Hub', url: '#', iconName: 'Rocket' },
];

export default class RapidCityHomepageWebPart extends BaseClientSideWebPart<IRapidCityHomepageWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IRapidCityHomepageProps> = React.createElement(RapidCityHomepage, {
      quickLinks: this._getQuickLinks(),
      contactCardsPageUrl: this.properties.contactCardsPageUrl || '/sites/intranet/SitePages/ContactCards.aspx',
      feedbackUrl: this.properties.feedbackUrl || '#',
      displayMode: this.displayMode,
    });

    ReactDom.render(element, this.domElement);
  }

  private _getQuickLinks(): IQuickLink[] {
    const json = this.properties.quickLinksJson?.trim();
    if (!json) return DEFAULT_QUICK_LINKS;
    try {
      const parsed = JSON.parse(json) as IQuickLink[];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_QUICK_LINKS;
    } catch {
      return DEFAULT_QUICK_LINKS;
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Rapid City Homepage settings',
          },
          groups: [
            {
              groupName: 'Links & URLs',
              groupFields: [
                PropertyPaneTextField('contactCardsPageUrl', {
                  label: 'Contact Cards page URL (for search redirect)',
                  description: 'e.g. /sites/intranet/SitePages/ContactCards.aspx',
                }),
                PropertyPaneTextField('feedbackUrl', {
                  label: 'Send Feedback link URL',
                }),
                PropertyPaneTextField('quickLinksJson', {
                  label: 'Quick Links (JSON)',
                  multiline: true,
                  description: 'JSON array: [{"label":"Employee Directory","url":"..."}]',
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
