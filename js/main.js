import { setLanguage, loadPage } from './modules/core.js';
import { setupTheme } from './modules/theme.js';
import { buildNavigation, buildFooter, buildDynamicPanel, createBackToTopFab, buildThemeSelector, buildLanguageSelector, populateStaticContent} from './modules/dom-builder.js';
import { setupNavigation, setupScrollBehavior, setupTopAppBarScrollBehavior, setupTitleClickListener, setupSheetScrollBehavior, setupThemeChooserEvents, setupLanguageChooserEvents } from './modules/events.js';

document.addEventListener('DOMContentLoaded', initializeApp);

/**
 * The main initialization function for the website.
 */
async function initializeApp() {
    // The global `window.config` is loaded first by index.html, so it's available here.
    console.log(`LOG: Initializing site for: ${window.config.appName}`);

    // Set up language and load the appropriate string file.
    await setLanguage();

    // Now that strings are loaded, populate all static content.
    populateStaticContent(); 
    buildNavigation();
    buildFooter();
    
    // Set up dynamic components and event listeners.
    setupTheme();
    buildThemeSelector();
    buildLanguageSelector();
    setupNavigation();
    setupThemeChooserEvents();
    setupLanguageChooserEvents();
    setupScrollBehavior();
    createBackToTopFab();
    setupTopAppBarScrollBehavior();
    setupTitleClickListener();
    buildDynamicPanel();
    setupSheetScrollBehavior();

    // Load the initial page based on the URL query parameter.
    const initialPageId = new URLSearchParams(window.location.search).get('page') || 'index';
    loadPage(initialPageId, true);

    // Handle browser back/forward navigation.
    window.onpopstate = (event) => {
        const pageId = (event.state && event.state.pageId) ? event.state.pageId : 'index';
        loadPage(pageId, true);
    };

    console.log("LOG: Application initialization complete.");
}