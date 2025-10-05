'use client';
import { useTranslationStore } from "@/stores/useTranslationStore";
import { useEffect } from "react";

export default function Home() {
  const { t, requireNamespaces, getAllMessages } = useTranslationStore();

  useEffect(() => {
    (async () => {
      await requireNamespaces(['auth', 'home']);
      console.log(await getAllMessages())
    })();
  }, []);

  return <>
    <h1>{t('home.title')}</h1>;
  </>
}