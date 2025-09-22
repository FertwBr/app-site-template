import { getStringsForLang, loadStrings } from '../strings.js';
import { 
    createIndexLayout, 
    createDefaultLayout, 
    createShimmerHTML, 
    updateActiveNav, 
    createPageFabs, 
    generateTOC, 
    buildDynamicPanel, 
    injectRoadmapSummary 
} from './dom-builder.js';
import { setupImageGallery, setupChangelogFilters } from './events.js';

let currentLang = 'en';

export function getCurrentLanguage() {
    return currentLang;
}

export async function setLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const langFromUrl = urlParams.get('lang');
    const browserLang = (navigator.languages?.[0] || navigator.language).split('-')[0].toLowerCase();
    
    currentLang = langFromUrl || localStorage.getItem('user-lang') || browserLang;
    await loadStrings(currentLang);
}

export function getUiString(key) {
    const keys = key.split('.');
    let result = getStringsForLang(currentLang);
    let fallbackResult = getStringsForLang('en');

    for (const k of keys) {
        result = result?.[k];
        fallbackResult = fallbackResult?.[k];
    }
    
    return result ?? fallbackResult ?? `[${key}]`;
}

async function getPageFile(pageId) {
    const pageData = window.config.pageConfig[pageId];
    if (!pageData) return null;

    const fileName = pageData.defaultFile;
    const langFilePath = `md/${currentLang}/${fileName}`;
    const fallbackFilePath = `md/en/${fileName}`;

    try {
        const response = await fetch(langFilePath, { method: 'HEAD' });
        if (response.ok) return langFilePath;
    } catch (e) {
        console.warn(`Network error checking for language file, falling back to English.`, e);
    }

    return fallbackFilePath;
}

export async function loadPage(pageId, isInitialLoad = false) {
    const appName = window.config.appName;
    const pageTitle = getUiString(`pages.${pageId}.title`);
    document.title = `${appName} - ${pageTitle}`;

    document.body.classList.toggle('panel-visible', pageId !== 'privacy');

    const contentContainer = document.getElementById('content-container');
    const contentWrapper = document.getElementById('content-wrapper');
    if (!contentWrapper || !contentContainer) {
        console.error("LOG: Content containers not found. Aborting page load.");
        return;
    }
    
    const filePath = await getPageFile(pageId);
    if (!filePath) {
        contentWrapper.innerHTML = `<p>Page not found.</p>`;
        return;
    }

    updateActiveNav(pageId);
    if (!isInitialLoad) {
        const url = new URL(window.location);
        url.searchParams.set('page', pageId);
        window.history.pushState({ pageId }, document.title, url);
    }

    contentWrapper.classList.add('fade-out');
    if (contentContainer.offsetHeight > 0) {
        contentContainer.style.height = `${contentContainer.offsetHeight}px`;
    }

    await new Promise(resolve => setTimeout(resolve, 200));

    contentWrapper.innerHTML = createShimmerHTML(pageId);
    window.scrollTo(0, 0);
    contentWrapper.classList.remove('fade-out');
    
    if (contentContainer.offsetHeight > 0) {
        contentContainer.style.height = `${contentWrapper.offsetHeight}px`;
    }

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Fetch failed for ${filePath}`);
        const markdown = await response.text();

        const tempDiv = document.createElement('div');
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.position = 'absolute';
        
        tempDiv.innerHTML = (pageId === 'index')
            ? await createIndexLayout(markdown)
            : await createDefaultLayout(markdown, pageId);
        
        document.body.appendChild(tempDiv);
        contentContainer.style.height = `${tempDiv.offsetHeight}px`;
        document.body.removeChild(tempDiv);

        contentWrapper.classList.add('fade-out');
        await new Promise(resolve => setTimeout(resolve, 150));
        
        contentWrapper.innerHTML = tempDiv.innerHTML;
        contentWrapper.classList.remove('fade-out');

        generateTOC(getUiString('pages.tocTitle'));
        
        if (pageId === 'index' || pageId === 'plus') setupImageGallery();
        if (pageId === 'changelog') setupChangelogFilters();
        if (pageId === 'index' || pageId === 'overview') await injectRoadmapSummary();

    } catch (error) {
        console.error(`Error loading content for page '${pageId}'.`, error);
        contentWrapper.innerHTML = `<p>Error loading content.</p>`;
    } finally {
        setTimeout(() => {
            if (document.body.contains(contentContainer)) {
                contentContainer.style.height = '';
            }
        }, 300);
    }

    createPageFabs(pageId);
    buildDynamicPanel();
}