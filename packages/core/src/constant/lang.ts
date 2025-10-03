/**
 * Supported languages configuration
 * Defines all available languages in the application
 */
export const LANGS = {
    fr: "fr", // French
    en: "en"  // English
} as const;

/**
 * Array of all supported language codes
 * Extracted from LANGS constant for easy validation
 */
export const SUPPORTED_LANGUAGES: string[] = Object.values(LANGS);

/**
 * Default fallback language used
 */
export const DEFAULT_LANGUAGE = LANGS.en;

/**
 * Checks if a given language is supported by the application
 * @param lang - The language code to validate (e.g., 'en', 'fr')
 * @returns {boolean} True if the language is supported, false otherwise
 * @example
 * isSupportedLanguage('en') // returns true
 * isSupportedLanguage('de') // returns false
 * isSupportedLanguage(undefined) // returns false
 */
export function isSupportedLanguage(lang?: string): boolean {
    if (!lang) return false;
    return SUPPORTED_LANGUAGES.includes(lang);
}

/**
 * Returns the provided language if supported, otherwise falls back to default
 * Safe way to ensure you always get a valid, supported language
 * @param lang - The language code to validate and return
 * @returns {string} The supported language or default fallback
 * @example
 * getSupportedLanguage('fr') // returns 'fr'
 * getSupportedLanguage('de') // returns 'en' (default)
 * getSupportedLanguage(undefined) // returns 'en' (default)
 */
export function getSupportedLanguage(lang?: string): string {
    return !!lang && isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;
}


/**
 * Extracts the base language code from Accept-Language header
 * Parses the browser's Accept-Language header to determine preferred language
 * 
 * @param acceptLanguage - The Accept-Language header value from browser (e.g., "fr-FR,fr;q=0.9,en-GB;q=0.8")
 * @param defaultLang - Fallback language if no Accept-Language header provided (default: DEFAULT_LANGUAGE)
 * @returns {string} The base language code in lowercase (e.g., "fr", "en")
 * 
 * @example
 * langFromAcceptLanguage("fr-FR,fr;q=0.9,en;q=0.8") // returns "fr"
 * langFromAcceptLanguage("en-US,en;q=0.9") // returns "en"
 * langFromAcceptLanguage(undefined, "fr") // returns "fr"
 * langFromAcceptLanguage(undefined) // returns  DEFAULT_LANGUAGE "en"
 */
export function langFromAcceptLanguage(acceptLanguage?: string, defaultLang: string = DEFAULT_LANGUAGE): string {
    // Return default if no Accept-Language header provided
    if (!acceptLanguage) return defaultLang;

    // Parse Accept-Language header format: "fr-FR,fr;q=0.9,en-GB;q=0.8"
    const firstLang = acceptLanguage.split(',')[0];   // Extract first language: "fr-FR"
    const baseLang = firstLang.split('-')[0];         // Remove region code: "fr"

    return baseLang.toLowerCase();                    // Normalize to lowercase: "fr"      
}