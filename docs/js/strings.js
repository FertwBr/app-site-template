let strings = {};

export async function loadStrings(lang) {
    try {
        const langModule = await import(`./strings/strings.${lang}.js`);
        strings[lang] = langModule[lang];
    } catch (error) {
        console.warn(`Strings for language '${lang}' not found. It will fall back to English.`);
    }

    if (!strings.en) {
        try {
            const enModule = await import('./strings/strings.en.example.js');
            strings.en = enModule.en;
        } catch (error) {
            console.error("Fatal Error: English strings (strings.en.js) could not be loaded.");
            strings.en = {};
        }
    }
}

export function getStringsForLang(lang) {
    return strings[lang] || strings.en;
}