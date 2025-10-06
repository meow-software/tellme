import {getRequestConfig} from 'next-intl/server';
import { getLang } from '../sessions';
import { loadNamespaceServer } from './loadMessages';

export default getRequestConfig(async () => {
  // Configuration of next-intl server
  const locale = await getLang();
  // load everything by default, first load is slow, but use cache after that
  const messages = await loadNamespaceServer(locale, ['common', 'auth']);
  return {
    locale,
    messages: messages
  };
});