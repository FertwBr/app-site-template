import { themeFromSourceColor, applyTheme } from '@material/material-color-utilities';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';

const THEME_STORAGE_KEY_PREFIX = 'app-site-theme-color-';

function getStorageKey() {
    return `${THEME_STORAGE_KEY_PREFIX}${window.config.appName.toLowerCase().replace(/\s+/g, '-')}`;
}

/**
 * Generates a full color palette for a given seed color.
 * @param {string} hexColor - The color in hex format.
 * @returns {{primary: string, secondary: string, tertiary: string}}
 */
function getThemePalette(hexColor) {
    try {
        if (!hexColor || !/^#([0-9A-F]{3}){1,2}$/i.test(hexColor)) {
            throw new Error(`Invalid hex color format: ${hexColor}`);
        }
        const theme = themeFromSourceColor(parseInt(hexColor.replace('#', ''), 16));
        const toHex = (color) => `#${(0x1000000 + color).toString(16).slice(1)}`;
        return {
            primary: toHex(theme.palettes.primary.tone(40)),
            secondary: toHex(theme.palettes.secondary.tone(40)),
            tertiary: toHex(theme.palettes.tertiary.tone(40))
        };
    } catch (error) {
        console.error(`Could not generate theme palette for color "${hexColor}".`, error);
        return { primary: '#BDBDBD', secondary: '#E0E0E0', tertiary: '#EEEEEE' };
    }
}

/**
 * Applies the complete theme based on the decided seed color.
 * @param {boolean} isDark - Whether the theme to be applied should be dark.
 */
export function updateTheme(isDark) {
    const seedColor = getSeedColor();
    if (!seedColor) {
        console.log("LOG: Native PWA dynamic theme is likely active. Skipping JS theme application.");
        return;
    }
    console.log(`LOG: Generating theme from seed color: ${seedColor}. Dark mode: ${isDark}`);
    try {
        const theme = themeFromSourceColor(parseInt(seedColor.replace('#', ''), 16));
        applyTheme(theme, { dark: isDark, target: document.documentElement });
        console.log("LOG: Full theme applied successfully.");
    } catch (error) {
        console.error("LOG: Error applying theme from seed color.", error);
    }
}

/**
 * Gets the correct seed color following the priority hierarchy.
 */
export function getSeedColor() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlTheme = urlParams.get('theme');
    if (urlTheme && /^([0-9A-F]{3}){1,2}$/i.test(urlTheme)) {
        return `#${urlTheme}`;
    }
    const savedTheme = localStorage.getItem(getStorageKey());
    if (savedTheme) {
        return savedTheme;
    }
    return window.config.seedColor;
}

/**
 * Generates the theme options for the theme selector UI.
 */
export function getThemeOptions() {
    return window.config.themeColors.map(color => ({
        ...color,
        palette: getThemePalette(color.value)
    }));
}

/**
 * Main function that initializes the theme system.
 */
export function setupTheme() {
    console.log("LOG: Initializing theme setup.");
    document.adoptedStyleSheets.push(typescaleStyles.styleSheet);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    updateTheme(mediaQuery.matches);
    mediaQuery.addEventListener('change', e => updateTheme(e.matches));
    
    console.log("LOG: Theme setup complete.");
}

export { getStorageKey };