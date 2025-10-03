export type SupportedLang = 'en' | 'fr';

export class I18n {
  private translations: Record<string, Record<string, string>>;

  constructor(translations: Record<string, Record<string, string>>) {
    this.translations = translations;
  }

  public t(
    key: string,
    lang: SupportedLang = 'en',
    vars: Record<string, string> = {}
  ): string {
    // 1. Récupère la chaîne traduite
    let text =
      this.translations[lang]?.[key] ||
      this.translations['en']?.[key] ||
      key;

    // 2. Remplace les variables dynamiques {appName}, {email}, etc.
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(new RegExp(`{${k}}`, 'g'), v);
    });

    return text;
  }
}
