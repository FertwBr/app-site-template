/**
 * =============================================================================
 * CONFIGURATION TEMPLATE
 * =============================================================================
 * This is a template file. DO NOT EDIT DIRECTLY in the template repository.
 *
 * To use this for a specific app site (e.g., Pixel Pulse), follow these steps:
 * 1. Copy this file into the root of your site's `docs` folder.
 * 2. Rename it from `config.default.js` to `config.js`.
 * 3. Fill in the placeholder values in the `AppConfig` object below
 *    with the specific details for your application.
 * =============================================================================
 */

const AppConfig = {
    // --- App Specific Variables (NEEDS TO BE CONFIGURED PER PROJECT) ---
    appName: "Your App Name", // e.g., "Pixel Pulse"
    siteVersion: '1.0.0',
    seedColor: '#006E2C', // A default green, change as needed
    playStoreLink: "https://play.google.com/store/apps/details?id=your.package.name",
    githubLink: "https://github.com/your-username/your-repo",
    carouselImages: [
        { type: 'phone', src: "art/phone-1.png", alt: "Main screen" },
        // Add more app-specific images here
    ],

    // --- Shared Structural Variables (Usually UNCHANGED) ---
    supportEmail: "fertwbr@programmer.net",

    supportedLanguages: [
        { code: 'en', name: 'English' }, { code: 'pt', name: 'Português' },
        { code: 'es', name: 'Español' }, { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' }, { code: 'it', name: 'Italiano' },
        { code: 'ja', name: '日本語' }, { code: 'ko', name: '한국어' },
        { code: 'zh-CN', name: '简体中文' }, { code: 'ru', name: 'Русский' },
        { code: 'ar', name: 'العربية' }, { code: 'hi', name: 'हिन्दी' },
        { code: 'nl', name: 'Nederlands' }, { code: 'tr', name: 'Türkçe' },
        { code: 'sv', name: 'Svenska' }, { code: 'pl', name: 'Polski' },
        { code: 'vi', name: 'Tiếng Việt' }, { code: 'id', name: 'Bahasa Indonesia' },
        { code: 'zh-TW', name: '繁體中文' }
    ],
    
    themeColors: [
        { name: 'Default', value: '#6750A4' }, { name: 'Indigo', value: '#3F51B5' },
        { name: 'Blue', value: '#2196F3' }, { name: 'Teal', value: '#009688' },
        { name: 'Green', value: '#4CAF50' }, { name: 'Amber', value: '#FFC107' },
        { name: 'Orange', value: '#FF9800' }, { name: 'Red', value: '#F44336' },
        { name: 'Purple', value: '#9C27B0' }, { name: 'Pink', value: '#E91E63' },
        { name: 'Brown', value: '#795548' }, { name: 'Grey', value: '#9E9E9E' },
    ],

    navItems: [
        { id: 'index', inactiveIcon: 'home', mobileShow: true },
        { id: 'plus', inactiveIcon: 'workspace_premium', mobileShow: true },
        { id: 'changelog', inactiveIcon: 'history' },
        { id: 'help', inactiveIcon: 'help_outline' },
        { id: 'privacy', inactiveIcon: 'shield_outline' }
    ],

    pageConfig: {
        'index': { defaultFile: 'index.md' },
        'plus': { defaultFile: 'app-plus.md' },
        'changelog': { defaultFile: 'changelog.md' },
        'help': { defaultFile: 'HELP_FAQ.md' },
        'privacy': { defaultFile: 'PRIVACY_POLICY.md' },
    }
};

window.config = AppConfig;