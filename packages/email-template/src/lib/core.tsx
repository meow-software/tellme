export * from '@tellme/core';

import  {AbstractI18n} from '@tellme/core';

import React from "react";

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
