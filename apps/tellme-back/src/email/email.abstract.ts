import * as React from 'react';

export interface EmailPayload {
  to: string;
  subject?: string;
  variables?: Record<string, any>;
}

export abstract class AbstractEmail {
  abstract subject: string;

  abstract render(variables?: Record<string, any>): React.ReactElement;

  renderText?(variables?: Record<string, any>): string;
}
