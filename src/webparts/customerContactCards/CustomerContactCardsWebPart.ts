import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import CustomerContactCards from './components/CustomerContactCards';
import { ICustomerContactCardsProps } from './components/ICustomerContactCardsProps';

export interface ICustomerContactCardsWebPartProps {
  title: string;
}

export default class CustomerContactCardsWebPart extends BaseClientSideWebPart<ICustomerContactCardsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ICustomerContactCardsProps> = React.createElement(
      CustomerContactCards,
      {
        title: this.properties.title || 'Customer Contact Cards',
        context: this.context,
      }
    );
    ReactDom.render(element, this.domElement);
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
          header: { description: 'Customer Contact Cards Settings' },
          groups: [
            {
              groupName: 'General',
              groupFields: [
                PropertyPaneTextField('title', {
                  label: 'Web Part Title',
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
