import { getCurrentLanguage, getUiString } from './core.js';
import { getSeedColor, getThemeOptions } from './theme.js';
import { Marked } from 'marked';

const marked = new Marked({ gfm: true, headerIds: true });
let testimonialInterval;
let proTipInterval;

/**
 * Builds all navigation elements (rail, drawer, mobile bar, footer links) from the config.
 */
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

/**
 * Populates the footer with dynamic, localized text from the strings file and config.
 */
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

/**
 * Builds the theme selector dialog content based on the colors defined in the config.
 */
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

/**
 * Builds the language selector dialog content based on the languages defined in the config.
 */
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

/**
 * Updates the active state of all navigation elements based on the current pageId.
 */
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

/**
 * Creates a shimmer/skeleton loading placeholder HTML structure.
 */
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

/**
 * Builds the layout for the index page, including the hero and gallery sections.
 */
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

/**
 * Builds the layout for any standard content page, with special handling for 'plus' and 'changelog'.
 */
export async function createDefaultLayout(markdown, pageId) {
    if (pageId === 'plus') {
        return createPlusPageLayout(markdown);
    }
    if (pageId === 'changelog') {
        return createChangelogLayout(markdown);
    }
    return `<div class="markdown-body">${await marked.parse(markdown)}</div>`;
}

/**
 * Generates a table of contents for the current page.
 */
export function generateTOC(tocTitle) {
    const contentDiv = document.querySelector('.markdown-body');
    const tocContainer = document.getElementById('toc-container');
    if (!contentDiv || !tocContainer) return;
    const headers = contentDiv.querySelectorAll('h2');
    if (headers.length < 2) {
        tocContainer.style.display = 'none';
        return;
    }
    const tocList = Array.from(headers).map(header => {
        if (!header.id) {
            header.id = header.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
        }
        return `<li><a href="#${header.id}">${header.textContent}</a></li>`;
    }).join('');
    tocContainer.innerHTML = `<h3 class="md-typescale-title-medium">${tocTitle}</h3><ul>${tocList}</ul>`;
    tocContainer.style.display = 'block';
}

/**
 * Creates page-specific Floating Action Buttons based on the pageId.
 */
export function createPageFabs(pageId) {
    const fabContainer = document.querySelector('.fab-container');
    if (!fabContainer) return;
    fabContainer.innerHTML = '';
    const fabSupportLabel = getUiString(`pages.${pageId}.fabSupport`);
    if (pageId === 'help' && fabSupportLabel) {
        const fabMail = document.createElement('md-fab');
        fabMail.variant = 'tertiary';
        fabMail.ariaLabel = fabSupportLabel;
        fabMail.innerHTML = '<md-icon slot="icon">email</md-icon>';
        fabMail.addEventListener('click', () => {
            window.location.href = `mailto:${window.config.supportEmail}?subject=${encodeURIComponent(getUiString('pages.help.title'))}`;
        });
        fabContainer.appendChild(fabMail);
    }
    const fabPlayStoreLabel = getUiString(`pages.${pageId}.fabPlayStore`);
    if (pageId === 'index' && fabPlayStoreLabel) {
        const fabStore = document.createElement('md-fab');
        fabStore.ariaLabel = fabPlayStoreLabel;
        fabStore.variant = 'primary';
        fabStore.innerHTML = '<md-icon slot="icon">storefront</md-icon>';
        fabStore.addEventListener('click', () => {
            window.open(window.config.playStoreLink, '_blank');
        });
        fabContainer.appendChild(fabStore);
    }
}

/**
 * Creates the "Back to Top" FAB.
 */
export function createBackToTopFab() {
    const fabContainerLeft = document.querySelector('.fab-container-left');
    if (!fabContainerLeft) return;
    const fab = document.createElement('md-fab');
    fab.id = 'back-to-top';
    fab.size = 'small';
    fab.ariaLabel = getUiString('backToTop');
    fab.innerHTML = '<md-icon slot="icon">arrow_upward</md-icon>';
    fabContainerLeft.appendChild(fab);
}

/**
 * Fetches the latest changelog entry to display in the side panel.
 */
async function fetchLatestChangelog() {
    const lang = getCurrentLanguage();
    let changelogPath = `md/${lang}/changelog.md`;
    let response;
    try {
        response = await fetch(changelogPath);
        if (!response.ok) {
            changelogPath = `md/en/changelog.md`;
            response = await fetch(changelogPath);
        }
    } catch (error) {
        return null;
    }
    if (!response.ok) return null;

    const markdown = await response.text();
    const sections = markdown.split(/^(?=##\s)/m);
    if (sections.length < 2) return null;

    const latestSectionMarkdown = sections[1];
    const sectionHtml = await marked.parse(latestSectionMarkdown);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sectionHtml;

    const h2 = tempDiv.querySelector('h2');
    const version = h2 ? h2.textContent.trim() : getUiString('panel.latestVersion');
    const em = tempDiv.querySelector('em');
    const date = em ? em.textContent.replace('Released', '').trim() : '';
    const summaryItems = Array.from(tempDiv.querySelectorAll('li > strong')).slice(0, 3).map(strong => `<li>${strong.textContent.trim().replace(/:$/, '')}</li>`);
    const summaryHtml = `<ul>${summaryItems.join('')}</ul>`;

    return { version, date, summaryHtml };
}

/**
 * Dynamically builds the content of the side panel.
 */
export function buildDynamicPanel() {
    const panel = document.getElementById('panel-cards-container');
    if (!panel) return;
    panel.innerHTML = '';
    clearInterval(testimonialInterval);
    clearInterval(proTipInterval);

    const ctaCardHTML = `<div class="panel-card cta-card"><h3><md-icon>storefront</md-icon> ${getUiString('panel.cardTitleCTA')}</h3><md-filled-button href="${window.config.playStoreLink}" target="_blank">${getUiString('panel.ctaButton')}</md-filled-button></div>`;
    panel.insertAdjacentHTML('beforeend', ctaCardHTML);

    const changelogPlaceholderHTML = `<div id="changelog-card-container" class="panel-card changelog-card"><h3><md-icon>history</md-icon> ${getUiString('panel.cardTitleUpdate')}</h3><div class="changelog-summary-content"><p>${getUiString('panel.loadingUpdate')}</p></div></div>`;
    panel.insertAdjacentHTML('beforeend', changelogPlaceholderHTML);

    fetchLatestChangelog().then(data => {
        const container = document.getElementById('changelog-card-container');
        if (container && data) {
            container.innerHTML = `<h3><md-icon>history</md-icon> ${getUiString('panel.cardTitleUpdate')}</h3><div class="changelog-summary-header"><span class="version">${data.version}</span><span class="date">${data.date}</span></div><div class="changelog-summary-content">${data.summaryHtml}</div><a href="#" data-page-id="changelog">${getUiString('panel.changelogLink')}</a>`;
        } else if (container) {
            container.querySelector('.changelog-summary-content').innerHTML = `<p>${getUiString('panel.updateError')}</p>`;
        }
    });

    const testimonials = getUiString('panel.testimonials');
    if (testimonials && testimonials.length > 0) {
        const card = document.createElement('div');
        card.className = 'panel-card testimonial-card';
        card.innerHTML = `<h3><md-icon>reviews</md-icon> ${getUiString('panel.cardTitleTestimonials')}</h3><div class="carousel-content"></div>`;
        panel.appendChild(card);
        let index = 0;
        const contentEl = card.querySelector('.carousel-content');
        const update = () => {
            const testimonial = testimonials[index];
            contentEl.style.opacity = 0;
            setTimeout(() => {
                contentEl.innerHTML = `<div class="stars">${'⭐'.repeat(testimonial.stars)}</div><p class="quote">"${testimonial.quote}"</p><span class="author">— ${testimonial.author}</span>`;
                contentEl.style.opacity = 1;
                index = (index + 1) % testimonials.length;
            }, 250);
        };
        update();
        testimonialInterval = setInterval(update, 8000);
    }

    const proTips = getUiString('panel.proTips');
    if (proTips && proTips.length > 0) {
        const card = document.createElement('div');
        card.className = 'panel-card tip-card';
        card.innerHTML = `<h3><md-icon>lightbulb</md-icon> ${getUiString('panel.cardTitleProTip')}</h3><div class="carousel-content"></div>`;
        panel.appendChild(card);
        let index = Math.floor(Math.random() * proTips.length);
        const contentEl = card.querySelector('.carousel-content');
        const update = () => {
            contentEl.style.opacity = 0;
            setTimeout(() => {
                contentEl.innerHTML = `<p>${proTips[index]}</p>`;
                contentEl.style.opacity = 1;
                index = (index + 1) % proTips.length;
            }, 250);
        };
        update();
        proTipInterval = setInterval(update, 7000);
    }
}

/**
 * Fetches and injects a summary of the roadmap into the DOM.
 */
export async function injectRoadmapSummary() {
    const container = document.getElementById('roadmap-summary-container');
    if (!container) return;
    const lang = getCurrentLanguage();
    let roadmapPath = `md/${lang}/roadmap.md`;
    let response;
    try {
        response = await fetch(roadmapPath);
        if (!response.ok) {
            roadmapPath = `md/en/roadmap.md`;
            response = await fetch(roadmapPath);
        }
    } catch (error) {
        container.innerHTML = `<p>Could not load roadmap summary.</p>`;
        return;
    }
    if (!response.ok) {
        container.innerHTML = `<p>Roadmap coming soon!</p>`;
        return;
    }
    const markdown = await response.text();
    const nextUpMatch = markdown.match(/##\s*🎯\s*Next Up([\s\S]*?)(?=##\s*🧭)/);
    if (nextUpMatch && nextUpMatch[1]) {
        container.innerHTML = await marked.parse(nextUpMatch[1].trim());
    } else {
        container.innerHTML = `<p>Planning future updates. Stay tuned!</p>`;
    }
}

/**
 * Populates static UI elements with app-specific content from the config.
 */
export function populateStaticContent() {
    const appName = window.config.appName;
    const iconPath = "art/icon.svg";
    document.getElementById('app-icon-header').src = iconPath;
    document.getElementById('app-title-header').textContent = appName;
    document.getElementById('app-icon-footer').src = iconPath;
    document.getElementById('app-title-footer').textContent = appName;
}

// --- Private Helper Functions ---

async function createPlusPageLayout(markdown) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = await marked.parse(markdown);
    const table = tempDiv.querySelector('table');
    if (table) {
        const featureGrid = document.createElement('div');
        featureGrid.className = 'feature-grid';
        table.querySelectorAll('tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 2) {
                featureGrid.innerHTML += `<div class="feature-card"><div class="feature-icon">${cells[0].innerHTML}</div><div class="feature-text">${cells[1].innerHTML}</div></div>`;
            }
        });
        table.replaceWith(featureGrid);
    }
    return `<div class="markdown-body">${tempDiv.innerHTML}</div>`;
}

async function createChangelogLayout(markdown) {
    const versionSections = markdown.split(/^(?=##\s)/m);
    let html = '';
    const pageHeaderHtml = await marked.parse(versionSections.shift() || '');
    for (let i = 0; i < versionSections.length; i++) {
        const versionMarkdown = versionSections[i];
        const isOpen = i === 0;
        const titleMatch = versionMarkdown.match(/^(## .*)/m);
        const versionTitleHtml = titleMatch ? await marked.parse(titleMatch[1]) : '';
        const dateMatch = versionMarkdown.match(/^\*\((.*)\)\*$/m);
        const dateHtml = dateMatch ? `<time class="version-date">${dateMatch[1]}</time>` : '';
        let contentMarkdown = versionMarkdown.replace(titleMatch ? titleMatch[0] : '', '').replace(dateMatch ? dateMatch[0] : '', '').trim();
        const platformSplits = contentMarkdown.split(/^(?=####\s)/m);
        let platformsHtml = '';
        for (const platformMd of platformSplits) {
            if (!platformMd.trim()) continue;
            const platformHeaderMatch = platformMd.match(/^(#### .*)/m);
            const platformName = platformHeaderMatch ? platformHeaderMatch[1].toLowerCase() : '';
            let platformId = 'other';
            if (platformName.includes('phone')) platformId = 'phone';
            else if (platformName.includes('wear os')) platformId = 'wear-os';
            else if (platformName.includes('website')) platformId = 'website';
            platformsHtml += `<div class="platform-section" data-platform="${platformId}">${await marked.parse(platformMd)}</div>`;
        }
        const summaryHtml = `<summary class="version-summary"><div class="version-title-wrapper">${versionTitleHtml}${dateHtml}</div><md-icon class="expand-icon">expand_more</md-icon></summary>`;
        html += `<details class="version-details" ${isOpen ? 'open' : ''}>${summaryHtml}<div class="version-content">${platformsHtml}</div></details>`;
    }
    const filterHTML = `<div id="changelog-filter-container"><md-chip-set id="changelog-filter-chips" type="filter"><md-filter-chip label="${getUiString('filters.all')}" data-platform="all" selected></md-filter-chip><md-filter-chip label="${getUiString('filters.website')}" data-platform="website"></md-filter-chip><md-filter-chip label="${getUiString('filters.wear_os')}" data-platform="wear-os"></md-filter-chip><md-filter-chip label="${getUiString('filters.phone')}" data-platform="phone"></md-filter-chip></md-chip-set></div>`;
    return `<div class="markdown-body">${pageHeaderHtml}${filterHTML}${html}</div>`;
}