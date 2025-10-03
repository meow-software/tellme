// export * from '@tellme/core';
// Todo: fix why can't use i18 of @tellme/core

export const CURRENT_LANG = 'en';

const DEFAULT_LANGUAGE = 'en';
export type SUPPORTED_LANGUAGES = string;


/**
 * Internationalization (i18n) class for handling translations
 * Supports dynamic variable replacement and fallback to default language
 */
export class I18n {
  private translations: Record<string, Record<string, string>>;
  private lang: SUPPORTED_LANGUAGES;

  /**
   * Creates a new I18n instance
   * @param translations - Object containing all translations by language
   * @param lang - Initial language (defaults to DEFAULT_LANGUAGE)
   */
  constructor(
    translations: Record<string, Record<string, string>>,
    lang: SUPPORTED_LANGUAGES = DEFAULT_LANGUAGE
  ) {
    this.translations = translations;
    this.lang = lang;
  }

  /**
   * Changes the active language
   * @param lang - The language to set as active
   */
  public setLanguage(lang: SUPPORTED_LANGUAGES): void {
    this.lang = lang;
  }

  /**
   * Returns the translation for the given key
   * Falls back to default language if key not found in current language
   * Falls back to the key itself if not found in default language
   * @param key - Translation key to look up
   * @param vars - Dynamic variables to replace in the text (e.g., {appName}, {email})
   * @returns The translated string with variables replaced
   */
  public t(key: string, vars: Record<string, string> = {}): string {
    // Get the translated string with fallback logic:
    // 1. Try current language
    // 2. Fall back to default language
    // 3. Fall back to the key itself
    let text =
      this.translations[this.lang]?.[key] ||
      this.translations[DEFAULT_LANGUAGE]?.[key] ||
      key;

    // Replace dynamic variables in the format {variableName}
    Object.entries(vars).forEach(([variableName, value]) => {
      text = text.replace(new RegExp(`{${variableName}}`, 'g'), value);
    });

    return text;
  }
}