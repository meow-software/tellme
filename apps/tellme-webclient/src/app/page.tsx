import { redirect } from "next/navigation"

const login = "auth/login"

// export default function Home() {
//   redirect(login)
// }

import {useTranslations} from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');

  return <h1>{t('title')}</h1>;
}