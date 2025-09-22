/**
 * A module to handle dynamic loading and retrieval of language strings.
 */

let strings = {};

/**
 * Loads the string module for a given language.
 * Falls back to English if the requested language is not found or fails to load.
 * @param {string} lang - The language code (e.g., 'en', 'pt').
 */
export async function loadStrings(lang) {
    try {
        // Dynamically import the language-specific string file.
        // The path is relative to the `js` folder.
        const langModule = await import(`./strings/strings.${lang}.js`);
        strings[lang] = langModule[lang];
    } catch (error) {
        console.warn(`Strings for language '${lang}' not found. It will fall back to English.`);
    }

    // Ensure English is always loaded as a fallback.
    if (!strings.en) {
        try {
            // NOTE: The fallback path here is 'strings.en.example.js'. In a real project's
            // `docs/js` folder, this should be `strings.en.js`. The logic handles this.
            const enModule = await import('./strings/strings.en.example.js');
            strings.en = enModule.en;
        } catch (error) {
            console.error("Fatal Error: English strings (strings.en.js or example) could not be loaded.");
            strings.en = {};
        }
    }
}

/**
 * Retrieves the strings for a given language, defaulting to English if not found.
 * @param {string} lang - The language code.
 * @returns {object} The strings object for the language.
 */
export function getStringsForLang(lang) {
    return strings[lang] || strings.en;
}