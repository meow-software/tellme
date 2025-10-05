'use client';

import { I18nMessagesRepository, useTranslationStore } from "@/stores/useTranslationStore";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import { ReactNode, useEffect } from "react";
import ClientTranslationProvider from "./ClientTranslationProvider";

export interface ClientLayoutI18nProps {
  children: ReactNode;
  locale: string;
  timeZone: string;
  // initialMessages: I18nMessagesRepository;
}

export default function ClientLayoutI18n({ children, locale, timeZone }: ClientLayoutI18nProps) {
  const store = useTranslationStore();

  return (
    <NextIntlClientProvider locale={locale} messages={store.getAllMessages()} timeZone={timeZone}>
      <ClientTranslationProvider locale={locale}>
        {children}
      </ClientTranslationProvider>
    </NextIntlClientProvider>
  );
}