import { TYPE_NODE_ENV, USERNAME_SIZE } from "../constant"

export function envIsProd(env: TYPE_NODE_ENV | string) {
    return env === "PROD"
}

export function envIsDev(env: TYPE_NODE_ENV | string) {
    return env === "DEV"
}

export /**
 * Generates a unique username from a base string
 * 
 * This function takes a string (such as a full name), cleans it,
 * normalizes it, and adds a random numeric suffix to create a unique
 * username compatible with most systems.
 * 
 * @param base - The base string to transform into a username (e.g., "Jean-François Dupont")
 * @param maxLength - Maximum length of the generated username (default: 20 characters)
 * @returns A formatted unique username (e.g., "jean_francois_dupont_0427")
 * 
 * @example
 * // Returns something like "marie_curie_1234"
 * generateUniqueUsername("Marie Curie");
 * 
 * @example
 * // Returns something like "jf_dupont_0427" with a max length of 15
 * generateUniqueUsername("Jean-François Dupont", 15);
 */
    function generateUniqueUsername(base: string, maxLength = 20): string {
    // Step 1: Clean and normalize the base string
    const clean = base
        // Decompose accented characters (é → e + ´)
        .normalize('NFD')
        // Remove diacritics (accents, cedillas, etc.)
        .replace(/[\u0300-\u036f]/g, '')
        // Replace all non-alphanumeric characters (except underscores) with underscores
        .replace(/[^a-zA-Z0-9_]/g, '_')
        // Convert to lowercase for consistency
        .toLowerCase();

    // Step 2: Generate a random numeric suffix
    // Create a number between 0 and 9999 and format it to 4 digits with leading zeros
    const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    // Step 3: Calculate maximum length for the base part
    // Reserve space for the suffix and the separator underscore
    const maxBaseLength = maxLength - (suffix.length + 1);

    // Step 4: Assemble the final result
    // Combine the truncated base, an underscore, and the suffix
    return `${clean.slice(0, maxBaseLength)}_${suffix}`;
}