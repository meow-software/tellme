import { JSX } from 'react';
import { AbstractEmail } from './email.abstract';

export class Email extends AbstractEmail {
  constructor(
    public readonly subject: string,
    protected readonly content: JSX.Element,
  ) {
    super();
  }

  render() {
    return this.content;
  }
}
