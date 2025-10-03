// export * from '@tellme/core';
// Todo: fix why can't use i18 of @tellme/core

import React from "react";

/**
 * Supported language keys and default.
 */
export type SUPPORTED_LANGUAGES = "en" | "fr";
export const DEFAULT_LANGUAGE: SUPPORTED_LANGUAGES = "en";

/**
 * Type for a variable that can be injected into translations.
 *
 * - string | number: simple value inserted as-is
 * - { value, render? }:
 *     - value: the real data to inject (string | number)
 *     - render?: optional function that receives the real value and
 *                returns either a string, a React node or any environment-specific node.
 *
 * Note: render is intentionally flexible so subclasses can decide how to interpret it.
 */
export type VarValue =
  | string
  | number
  | {
    value: string | number;
    render?: (value: string | number) => unknown;
  };

/** Map of variable name -> VarValue */
export type Vars = Record<string, VarValue>;

/**
 * -------------------------
 * AbstractI18n (abstract)
 * -------------------------
 *
 * Responsibilities:
 *  - Lookup translation with fallback (current language -> default -> key)
 *  - Parse translation and split into text / placeholders ({{var}})
 *  - Replace placeholders with provided values or with render(value)
 *  - Delegate the *final rendering* to subclasses via the abstract renderOutput()
 *
 * === Examples (translations format) ===
 * const translations = {
 *   en: {
 *     greeting: "Hello {{user}}, you are {{age}} years old and live in {{city}}."
 *   },
 *   fr: {
 *     greeting: "Bonjour {{user}}, vous avez {{age}} ans et habitez {{city}}."
 *   }
 * };
 *
 * Subclass responsibilities:
 *  - ReactI18n implements renderOutput(...) returning JSX (Fragment or string)
 *  - I18n implements renderOutput(...) returning string
 *
 * The `t()` method always returns what renderOutput(...) returns.
 */
export abstract class AbstractI18n {
  protected translations: Record<string, Record<string, string>>;
  protected lang: SUPPORTED_LANGUAGES;

  /**
   * Create an i18n instance.
   * @param translations - translations object keyed by language, then key
   * @param lang - initial language (defaults to DEFAULT_LANGUAGE)
   */
  constructor(
    translations: Record<string, Record<string, string>>,
    lang: SUPPORTED_LANGUAGES = DEFAULT_LANGUAGE
  ) {
    this.translations = translations;
    this.lang = lang;
  }

  /** Change the active language */
  public setLanguage(lang: SUPPORTED_LANGUAGES): void {
    this.lang = lang;
  }

  /**
   * Translate a key and interpolate variables.
   *
   * Behaviour:
   * 1) Look up translation in current language.
   * 2) If missing, fallback to DEFAULT_LANGUAGE.
   * 3) If still missing, fallback to the key itself.
   * 4) Split the translation string on `{{var}}` placeholders.
   * 5) For each placeholder:
   *     - If the provided var is a plain string/number → inject it.
   *     - If the provided var is an object `{ value, render? }`:
   *         - if render is provided -> call render(value) and use its return value
   *         - otherwise -> use the raw value
   * 6) Delegate final rendering to subclasses by calling `renderOutput(result)`
   *
   * @param key - translation key
   * @param vars - variables map (see VarValue)
   * @returns whatever `renderOutput` returns (string, JSX, HTML fragment, ...)
   *
   * @example Basic (plain values)
   * i18n.t("greeting", { user: "Alice", age: 30, city: "Paris" });
   *
   * @example With renderers (React)
   * i18n.t("greeting", {
   *   user: { value: "Alice", render: (v) => <strong>{v}</strong> },
   *   age: { value: 30, render: (v) => <em>{v}</em> },
   *   city: "Paris"
   * });
   */
  public t(key: string, vars: Vars = {}): any {
    // ---------- 1) Lookup with fallback ----------
    const text =
      this.translations[this.lang]?.[key] ||
      this.translations[DEFAULT_LANGUAGE]?.[key] ||
      key;

    // ---------- 2) Split into text & placeholders ----------
    // Keep placeholders in the array by using a capturing group.
    // Example: "Hello {{user}}!" => ["Hello ", "{{user}}", "!"]
    const parts = text.split(/(\{\{.+?\}\})/g);

    // ---------- 3) Replace placeholders ----------
    // result: array of strings or the output of render functions (possibly React nodes)
    const result: Array<string | unknown> = parts.map((part) => {
      const match = part.match(/\{\{(.+?)\}\}/);
      if (!match) {
        // plain text, return as-is
        return part;
      }

      const varName = match[1];
      const raw = vars[varName];

      // If the variable is an object like { value, render? }
      if (raw && typeof raw === "object" && "value" in raw) {
        const value = raw.value;
        // If a render function exists, call it with the *real value*
        if (typeof raw.render === "function") {
          try {
            return raw.render(value);
          } catch (err) {
            // render functions should not break the whole i18n pipeline;
            // on error, fallback to the raw value as string
            // (consumer may prefer different error handling)
            // eslint-disable-next-line no-console
            console.error(`[I18n] render function for "${varName}" threw:`, err);
            return String(value);
          }
        }
        // no render: return raw value as string/number
        return value;
      }

      // If variable is a plain string or number, return it
      if (typeof raw === "string" || typeof raw === "number") {
        return raw;
      }

      // If variable not provided, return empty string (could also return the placeholder)
      return "";
    });

    // ---------- 4) Delegate final rendering to subclass ----------
    // Subclasses must implement renderOutput(result)
    return this.renderOutput(result);
  }


  /**
   * Subclasses implement how to combine the pieces into a final result
   * (string, React elements, HTML, etc.)
   */
  protected abstract renderOutput(result: Array<string | unknown>): any;
}

/**
 * -------------------------
 * I18n
 * -------------------------
 * 
 * Simple string-based implementation that always returns a joined string.
 * Optimized for Node.js, CLI, or any environment where plain text output is required.
 * React elements are automatically converted to empty strings to avoid [object Object] output.
 * 
 * USAGE EXAMPLES:
 * 
 * const translations = {
 *   en: {
 *     greet: "Hello {{user}}, you are {{age}}."
 *   }
 * };
 * 
 * const i18nPlain = new I18n(translations, "en");
 * 
 * console.log(
 *   i18nPlain.t("greet", {
 *     user: { value: "Alice", render: (v) => `**${v}**` }, // render returns a string
 *     age: 25
 *   })
 * );
 * // -> "Hello **Alice**, you are 25."
 */
export class I18n extends AbstractI18n {
  protected renderOutput(result: Array<string | unknown>): string {
    // Convert all parts to strings, handling only primitives (string/number)
    // React elements and other objects are converted to empty strings to prevent [object Object]
    return result
      .map((r) => (typeof r === "string" || typeof r === "number" ? String(r) : ""))
      .join("");
  }
}

// Todo enlever tous ce quil y a au dessu apres avoir fixer l'import (c'est déjà sur @tellme/core)

export const CURRENT_LANG = 'fr'

/**
 * -------------------------
 * ReactI18n
 * -------------------------
 * 
 * React-specific implementation that handles mixed content of strings and React elements.
 * Returns a React Fragment if any part contains React elements, otherwise returns a plain string.
 * 
 * USAGE EXAMPLES:
 * 
 * const translations = {
 *   en: {
 *     greeting: "Hello {{user}}, you are {{age}} years old and live in {{city}}."
 *   }
 * };
 * 
 * const i18n = new ReactI18n(translations, "en");
 * 
 * // In a React component:
 * function App() {
 *   return (
 *     <div>
 *       {i18n.t("greeting", {
 *         user: { value: "Alice", render: (v) => <strong>{v}</strong> },
 *         age: { value: 30, render: (v) => <em>{v}</em> },
 *         city: "Paris"
 *       })}
 *     </div>
 *   );
 * }
 */
export class ReactI18n extends AbstractI18n {
  protected renderOutput(result: Array<string | unknown>): React.ReactNode {
    // Check if any element in the result array is a valid React element
    const hasReactElement = result.some((r) => React.isValidElement(r));

    if (hasReactElement) {
      return (
        <>
          {result.map((item, idx) => {
            if (React.isValidElement(item)) {
              // Clone React elements with proper keys to avoid key warnings
              return React.cloneElement(item, { key: idx });
            }
            // Convert non-React elements to strings and wrap in Fragment with key
            return <React.Fragment key={idx}>{String(item ?? "")}</React.Fragment>;
          })}
        </>
      );
    }

    // If no React elements are present, join all parts as a plain string for better performance
    return result.map((r) => String(r ?? "")).join("");
  }
}
