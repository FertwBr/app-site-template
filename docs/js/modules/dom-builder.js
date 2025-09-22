import { getCurrentLanguage, getUiString } from './core.js';
import { getSeedColor, getThemeOptions } from './theme.js';
import { Marked } from 'marked';

const marked = new Marked({ gfm: true, headerIds: true });
let testimonialInterval;
let proTipInterval;

export function buildNavigation() {
    console.log("LOG: Building navigation elements.");
    const railContainer = document.querySelector('.custom-nav-rail');
    const drawerContainer = document.querySelector('md-navigation-drawer md-list');
    const mobileContainer = document.querySelector('.custom-nav-bar');
    const footerLinksContainer = document.querySelector('.footer-links');
    const mobileSheetList = document.getElementById('mobile-sheet-menu-list');

    if (!railContainer || !drawerContainer || !mobileContainer || !footerLinksContainer || !mobileSheetList) {
        console.error("LOG: One or more navigation containers not found.");
        return;
    }

    [railContainer, drawerContainer, mobileContainer, footerLinksContainer, mobileSheetList].forEach(el => el.innerHTML = '');

    const navItems = window.config.navItems;
    const mainMobileItems = navItems.filter(item => item.mobileShow);
    const moreMenuItems = navItems.filter(item => !item.mobileShow);

    navItems.forEach(item => {
        const baseIcon = item.inactiveIcon.replace('_outline', '');
        const navKey = `nav.${item.id}`;
        const label = getUiString(`${navKey}.label`);
        const drawerLabel = getUiString(`${navKey}.drawerLabel`) || label;

        railContainer.innerHTML += `<a class="rail-item" href="#" data-page-id="${item.id}"><md-icon>${baseIcon}</md-icon><span class="label">${label}</span><md-ripple></md-ripple></a>`;

        const drawerItem = document.createElement('md-list-item');
        drawerItem.className = 'nav-drawer-item';
        drawerItem.type = 'button';
        drawerItem.dataset.pageId = item.id;
        drawerItem.innerHTML = `<md-icon slot="start">${baseIcon}</md-icon>${drawerLabel}`;
        drawerContainer.appendChild(drawerItem);

        footerLinksContainer.innerHTML += `<li><a href="#" data-page-id="${item.id}">${drawerLabel}</a></li>`;
    });

    mainMobileItems.forEach(item => {
        const baseIcon = item.inactiveIcon.replace('_outline', '');
        mobileContainer.innerHTML += `<a class="mobile-item" href="#" data-page-id="${item.id}"><md-icon>${baseIcon}</md-icon><span class="label">${getUiString(`nav.${item.id}.label`)}</span><md-ripple></md-ripple></a>`;
    });

    if (moreMenuItems.length > 0) {
        const moreButton = document.createElement('md-icon-button');
        moreButton.id = 'mobile-more-button';
        moreButton.className = 'mobile-item';
        moreButton.innerHTML = `<md-icon>more_horiz</md-icon>`;
        mobileContainer.appendChild(moreButton);

        moreMenuItems.forEach(item => {
            const listItem = document.createElement('md-list-item');
            listItem.setAttribute('data-page-id', item.id);
            listItem.innerHTML = `
                <md-icon slot="start">${item.inactiveIcon.replace('_outline', '')}</md-icon>
                <div slot="headline">${getUiString(`nav.${item.id}.drawerLabel`)}</div>
            `;
            mobileSheetList.appendChild(listItem);
        });
    }
    console.log("LOG: Navigation elements built.");
}

export function buildFooter() {
    document.getElementById('footer-app-description').textContent = getUiString('footerAppDescription');
    document.getElementById('footer-links-title').textContent = getUiString('footerLinksTitle');
    document.getElementById('footer-connect-title').textContent = getUiString('footerConnectTitle');
    const supportLink = document.getElementById('footer-support-link');
    supportLink.textContent = getUiString('footerSupportLink');
    supportLink.href = `mailto:${window.config.supportEmail}?subject=${encodeURIComponent(getUiString('pages.help.title'))}`;
    document.getElementById('footer-copyright').textContent = getUiString('footerCopyright').replace('{appName}', window.config.appName);

    const versionEl = document.getElementById('site-version');
    if (versionEl && window.config.siteVersion) {
        versionEl.textContent = `v${window.config.siteVersion}`;
    } else if (versionEl) {
        versionEl.style.display = 'none';
    }
}

export function buildThemeSelector() {
    const container = document.getElementById('theme-dialog-content');
    if (!container) return;

    const currentSeedColor = getSeedColor();
    const themeOptions = getThemeOptions();

    const themeOptionsHtml = themeOptions.map(theme => {
        const isActive = currentSeedColor === theme.value;
        return `
            <div class="theme-option" data-color="${theme.value}" aria-label="${theme.name}" role="button" tabindex="0">
                <div class="theme-preview-wrapper ${isActive ? 'active' : ''}">
                    <div class="theme-preview-circle">
                        <div class="primary-half" style="background-color: ${theme.palette.primary};"></div>
                        <div class="secondary-quarter" style="background-color: ${theme.palette.secondary};"></div>
                        <div class="tertiary-quarter" style="background-color: ${theme.palette.tertiary};"></div>
                    </div>
                </div>
                <span class="theme-name">${theme.name}</span>
            </div>
        `;
    }).join('');

    container.innerHTML = `<div class="theme-options-grid">${themeOptionsHtml}</div>`;
}

export function buildLanguageSelector() {
    const container = document.getElementById('lang-dialog-content');
    if (!container) return;

    const currentLangCode = getCurrentLanguage();
    const langOptionsHtml = window.config.supportedLanguages.map(lang => {
        const isActive = currentLangCode === lang.code;
        return `
            <div class="lang-option" data-lang="${lang.code}" aria-label="${lang.name}" role="button" tabindex="0">
                <span class="lang-name ${isActive ? 'active' : ''}">${lang.name}</span>
                ${isActive ? '<md-icon class="active-lang-icon">check_circle</md-icon>' : ''}
            </div>
        `;
    }).join('');

    container.innerHTML = `<div class="lang-options-grid">${langOptionsHtml}</div>`;
}

export function updateActiveNav(pageId) {
    const allNavItems = document.querySelectorAll('[data-page-id]');
    allNavItems.forEach(item => {
        item.toggleAttribute('active', item.dataset.pageId === pageId);
    });

    const moreButton = document.getElementById('mobile-more-button');
    if (moreButton) {
        const currentPageConfig = window.config.navItems.find(item => item.id === pageId);
        moreButton.toggleAttribute('active', currentPageConfig && !currentPageConfig.mobileShow);
    }
}

export function createShimmerHTML(pageId) {
    if (pageId === 'index') {
        return `
        <div class="shimmer-wrapper" aria-hidden="true">
            <div class="shimmer-hero-wrapper">
                <div class="shimmer-hero-text">
                    <div class="shimmer-placeholder shimmer-title"></div>
                    <div class="shimmer-placeholder shimmer-line medium"></div>
                    <div class="shimmer-placeholder shimmer-line"></div>
                    <div class="shimmer-placeholder shimmer-line short"></div>
                </div>
                <div class="shimmer-hero-image shimmer-placeholder"></div>
            </div>
        </div>`;
    }
    return `
    <div class="shimmer-wrapper" aria-hidden="true">
        <div class="shimmer-placeholder shimmer-title"></div>
        <div class="shimmer-placeholder shimmer-line"></div>
        <div class="shimmer-placeholder shimmer-line short"></div>
    </div>`;
}

export async function createIndexLayout(markdown) {
    const heroTextMatch = markdown.match(/^# .*?(## .*?)(?=\n## )/s);
    const heroTextMarkdown = heroTextMatch ? heroTextMatch[0] : markdown;
    const mainContentMarkdown = markdown.replace(heroTextMarkdown, '');
    const galleryImages = window.config.carouselImages;

    const galleryHtml = `
        <div class="gallery-main-image">
            <img src="${galleryImages[0].src}" alt="${galleryImages[0].alt}" id="main-gallery-image">
        </div>
        <div class="gallery-thumbnails">
            ${galleryImages.map((img, index) => 
                `<img src="${img.src}" alt="${img.alt}" class="thumbnail ${index === 0 ? 'active' : ''} ${img.type || 'phone'}" data-index="${index}">`
            ).join('')}
        </div>`;
    
    return `<section class="hero"><div class="hero-text markdown-body">${await marked.parse(heroTextMarkdown)}</div><div class="hero-gallery">${galleryHtml}</div></section><div id="main-content" class="markdown-body">${await marked.parse(mainContentMarkdown)}</div>`;
}

export async function createDefaultLayout(markdown, pageId) {
    if (pageId === 'plus') {
        return createPlusPageLayout(markdown);
    }
    if (pageId === 'changelog') {
        return createChangelogLayout(markdown);
    }
    return `<div class="markdown-body">${await marked.parse(markdown)}</div>`;
}

// ...rest of your code, making sure to always use window.config instead of imported config
