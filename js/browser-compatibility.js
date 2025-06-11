/**
 * Cross-Browser Testing Script for SpotiDeals
 * 
 * This script detects browser capabilities and applies fixes for known issues
 * in specific browsers. It helps ensure the dark theme works correctly across
 * different browsers and devices.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Cross-browser compatibility script loaded');
    
    // Detect browser
    const browser = detectBrowser();
    console.log('Detected browser:', browser);
    
    // Add browser-specific class to body for CSS targeting
    document.body.classList.add(`browser-${browser.name.toLowerCase()}`);
    
    // Apply browser-specific fixes
    applyBrowserFixes(browser);
    
    // Test features needed for dark theme
    testDarkThemeFeatures();
});

/**
 * Detect the current browser and version
 */
function detectBrowser() {
    const ua = navigator.userAgent;
    let browserName = "unknown";
    let browserVersion = "unknown";
    
    // Detect Chrome
    if (/Chrome/.test(ua) && !/Chromium|Edge|Edg|OPR|Opera/.test(ua)) {
        browserName = "Chrome";
        browserVersion = ua.match(/Chrome\/(\d+\.\d+)/)[1];
    } 
    // Detect Firefox
    else if (/Firefox/.test(ua)) {
        browserName = "Firefox";
        browserVersion = ua.match(/Firefox\/(\d+\.\d+)/)[1];
    } 
    // Detect Safari
    else if (/Safari/.test(ua) && !/Chrome|Chromium|Edge|Edg|OPR|Opera/.test(ua)) {
        browserName = "Safari";
        browserVersion = ua.match(/Version\/(\d+\.\d+)/)[1];
    }
    // Detect Edge
    else if (/Edg|Edge/.test(ua)) {
        browserName = "Edge";
        browserVersion = ua.match(/Edg(?:e)?\/(\d+\.\d+)/)[1];
    }
    // Detect IE (unlikely but just in case)
    else if (/Trident|MSIE/.test(ua)) {
        browserName = "IE";
        browserVersion = ua.match(/(?:MSIE |rv:)(\d+\.\d+)/)[1];
    }
    // Detect Opera
    else if (/OPR|Opera/.test(ua)) {
        browserName = "Opera";
        browserVersion = ua.match(/(?:OPR|Opera)\/(\d+\.\d+)/)[1];
    }
    
    // Detect mobile
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/.test(ua);
    
    return {
        name: browserName,
        version: browserVersion,
        mobile: isMobile,
        userAgent: ua
    };
}

/**
 * Apply browser-specific fixes
 */
function applyBrowserFixes(browser) {
    // Safari-specific fixes
    if (browser.name === "Safari") {
        // Fix for Safari's backdrop-filter issues with transitions
        document.documentElement.style.setProperty('--backdrop-filter-transition', 'none');
        
        // Fix for Safari's WebP support issues (older versions)
        checkWebPSupport();
    }
    
    // Firefox-specific fixes
    if (browser.name === "Firefox") {
        // Fix for Firefox's scrollbar styles
        const style = document.createElement('style');
        style.textContent = `
            * {
                scrollbar-width: thin;
                scrollbar-color: var(--spotify-green) var(--dark-bg-tertiary);
            }
        `;
        document.head.appendChild(style);
    }
    
    // IE and old Edge fixes
    if (browser.name === "IE" || (browser.name === "Edge" && parseFloat(browser.version) < 79)) {
        // Disable animations and effects that don't work well
        document.documentElement.classList.add('reduced-animations');
        
        // Alert for very old browsers
        if (browser.name === "IE") {
            console.warn('Internet Explorer is not fully supported. Some features may not work correctly.');
        }
    }
    
    // Mobile optimizations
    if (browser.mobile) {
        document.documentElement.classList.add('mobile-device');
        
        // Reduce particle counts for better performance
        if (typeof window.reduceParticleCount === 'function') {
            window.reduceParticleCount(true);
        }
    }
}

/**
 * Check if the browser supports WebP images
 */
function checkWebPSupport() {
    const webPTest = new Image();
    webPTest.onload = function() {
        // WebP is supported
        document.documentElement.classList.add('webp-support');
    };
    webPTest.onerror = function() {
        // WebP is not supported, fallback to SVG/PNG
        document.documentElement.classList.add('no-webp-support');
        
        // Force all picture sources to use the fallback
        document.querySelectorAll('picture > source[type="image/webp"]').forEach(source => {
            source.remove();
        });
        
        console.warn('WebP images not supported in this browser, using fallback images');
    };
    webPTest.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
}

/**
 * Test features needed for dark theme
 */
function testDarkThemeFeatures() {
    // Test CSS Variables support
    const cssVarSupported = window.CSS && window.CSS.supports && window.CSS.supports('--test', '0');
    
    if (!cssVarSupported) {
        console.warn('CSS Variables not supported! Dark theme may not work correctly.');
        document.documentElement.classList.add('no-css-vars');
        
        // Add a warning message for very old browsers
        const warningDiv = document.createElement('div');
        warningDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; padding: 10px; background: #f44336; color: white; text-align: center; z-index: 9999;';
        warningDiv.textContent = 'Votre navigateur est obsolète et n\'est pas entièrement compatible avec notre site. Certaines fonctionnalités peuvent ne pas fonctionner correctement.';
        document.body.prepend(warningDiv);
    }
    
    // Test prefers-color-scheme media query support
    const prefersColorSchemeSupported = window.matchMedia('(prefers-color-scheme)').media !== 'not all';
    if (prefersColorSchemeSupported) {
        document.documentElement.classList.add('supports-color-scheme-preference');
    }
}
