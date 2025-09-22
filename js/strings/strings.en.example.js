/**
 * =============================================================================
 * ENGLISH STRINGS TEMPLATE (strings.en.example.js)
 * =============================================================================
 * This is a template for the English language strings.
 *
 * To use this for a specific app site (e.g., Pixel Pulse):
 * 1. Copy this file into the `js/strings/` folder of your site's `docs`.
 * 2. Rename it to `strings.en.js`.
 * 3. Replace all placeholder values with the specific text for your application.
 * =============================================================================
 */

export const en = {
    backToTop: 'Back to top',
    footerAppDescription: 'A brief, catchy description of your amazing app for Android and Wear OS.',
    footerLinksTitle: 'Links',
    footerConnectTitle: 'Connect',
    footerSupportLink: 'Contact Support',
    footerCopyright: `© ${new Date().getFullYear()} {appName}. All Rights Reserved.`,
    nav: {
        index: { label: 'Home', drawerLabel: 'Home' },
        plus: { label: 'Plus', drawerLabel: 'App Name+' },
        changelog: { label: 'Changelog', drawerLabel: 'Version History' },
        help: { label: 'Help', drawerLabel: 'Help & FAQ' },
        privacy: { label: 'Privacy', drawerLabel: 'Privacy Policy' },
        more: { label: 'More' }
    },
    pages: {
        index: { title: 'App Name: Main Feature', fabPlayStore: 'Get on Play Store' },
        plus: { title: 'App Name+ Features' },
        changelog: { title: 'App Name - Version History' },
        help: { title: 'App Name - Help & FAQ', fabSupport: 'Contact Support' },
        privacy: { title: 'App Name - Privacy Policy' },
        tocTitle: 'On this page'
    },
    panel: {
        cardTitleCTA: 'Get the App',
        cardTitleUpdate: 'Always Improving',
        cardTitleTestimonials: 'From Our Users',
        cardTitleProTip: 'Did You Know?',
        ctaButton: 'Get it on Google Play',
        changelogLink: 'See full history',
        loadingUpdate: 'Loading latest update...',
        updateError: 'Could not load update details.',
        testimonials: [
            { stars: 5, quote: 'This app is fantastic and beautiful!', author: 'A Happy User' },
            { stars: 5, quote: 'Works perfectly and does exactly what I need.', author: 'An Android Enthusiast' }
        ],
        proTips: [
            'This is a pro tip specific to your application\'s features.',
            'Here is another useful hint for users to discover.',
            'Explain a cool but perhaps hidden feature of your app here.'
        ]
    },
    filters: {
        all: 'All',
        website: 'Website',
        wear_os: 'Wear OS',
        phone: 'Phone'
    }
};