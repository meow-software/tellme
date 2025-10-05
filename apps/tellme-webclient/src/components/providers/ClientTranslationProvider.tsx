'use client';
import { useTranslations } from 'next-intl';
import { useTranslationStore } from '@/stores/useTranslationStore';
import { useEffect, ReactNode } from 'react';

interface ClientTranslationProviderProps {
    children: ReactNode;
    locale: string;
}

export default function ClientTranslationProvider({ children, locale }: ClientTranslationProviderProps) {
    const store = useTranslationStore();
    const tNext = useTranslations(); // Hook client, nécessite le NextIntlProvider au-dessus

    useEffect(() => {
        // On ne met à jour que si le t actuel est différent
        if (store.t !== tNext) {
            store.setNextIntlT(tNext);
        }
        if (store.locale !== locale) {
            store.setLocale(locale);
        }
    }, [tNext, locale]);

    return children;
}
