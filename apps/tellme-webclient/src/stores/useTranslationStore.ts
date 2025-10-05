import { DEFAULT_LANGUAGE } from '@/lib';
import { create } from 'zustand';

export type I18nMessagesRepository = Record<string, Record<string, string>>;

interface TranslationState {
    locale: string;
    messages: I18nMessagesRepository;
    setLocale: (locale: string) => void;
    requireNamespaces: (namespaces: string[]) => Promise<void>;
    reloadNamespaces: () => Promise<void>;
    t: any; // on remplace par le t de next-intl
    setNextIntlT: (t: any) => void; // nouvelle fonction
    getAllMessages: () => I18nMessagesRepository; // récupérer tous les messages pour le provider
}

export const useTranslationStore = create<TranslationState>((set, get) => ({
    locale: DEFAULT_LANGUAGE,
    messages: {},

    setLocale: (locale) => set({ locale }),

    requireNamespaces: async (namespaces) => {
        const { messages, locale } = get();
        const toLoad = namespaces.filter(ns => !messages[ns]);

        if (toLoad.length === 0) return;

        const loaded: I18nMessagesRepository = {};
        await Promise.all(
            toLoad.map(async ns => {
                const res = await fetch(`/locales/${locale}/${ns}.json`);
                loaded[ns] = await res.json();
            })
        );

        set({ messages: { ...messages, ...loaded } });
    },
    reloadNamespaces: async () => {
        const { messages, requireNamespaces } = get();

        // On récupère les namespaces déjà chargés
        const namespaces = Object.keys(messages);

        // On vide les messages actuels
        set({ messages: {} });

        // On recharge les namespaces pour la langue active
        if (namespaces.length > 0) {
            await requireNamespaces(namespaces);
        }
    },
    // par défaut t renvoie une clé brute
    t: (key: any) => key,

    // mettre à jour le t de next-intl
    setNextIntlT: (nextT: any) => set({ t: nextT }),

    getAllMessages: () => {
        const { messages } = get();
        return messages;
    }
}));