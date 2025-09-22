import '@material/web/all.js';
import { setLanguage, loadPage } from './modules/core.js';
import { setupTheme } from './modules/theme.js';
import { buildNavigation, buildFooter, buildDynamicPanel, createBackToTopFab, buildThemeSelector, buildLanguageSelector } from './modules/dom-builder.js';
import { setupNavigation, setupScrollBehavior, setupTopAppBarScrollBehavior, setupTitleClickListener, setupSheetScrollBehavior, setupThemeChooserEvents, setupLanguageChooserEvents } from './modules/events.js';

document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    console.log(`LOG: Initializing site for: ${window.config.appName}`);

    await setLanguage();

    setupTheme();
    buildNavigation();
    buildFooter();
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

    const initialPageId = new URLSearchParams(window.location.search).get('page') || 'index';
    loadPage(initialPageId, true);

    window.onpopstate = (event) => {
        const pageId = (event.state && event.state.pageId) ? event.state.pageId : 'index';
        console.log(`LOG: Popstate event detected, navigating to page: ${pageId}`);
        loadPage(pageId, true);
    };

    console.log("LOG: Application initialization complete.");
}