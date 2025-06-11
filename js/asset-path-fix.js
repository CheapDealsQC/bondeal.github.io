/**
 * Asset Path Verification for SpotiDeals
 * This script runs on page load to verify that assets can load correctly
 * and fixes common path issues that may occur with GitHub Pages deployments
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Asset verification script loaded');
    
    // Function to check if we're on GitHub Pages
    function isGitHubPages() {
        return window.location.hostname.endsWith('github.io');
    }
    
    // Test if an asset is loadable
    function testAsset(path) {
        return new Promise((resolve, reject) => {
            const testImg = new Image();
            testImg.onload = () => resolve(true);
            testImg.onerror = () => resolve(false);
            testImg.src = path;
            
            // Timeout after 3 seconds
            setTimeout(() => resolve(false), 3000);
        });
    }
    
    // Generate alternative paths to try
    function getAlternativePaths(originalPath) {
        const paths = [];
        
        // Try without leading slash
        if (originalPath.startsWith('/')) {
            paths.push(originalPath.substring(1));
        }
        
        // Try with leading slash
        if (!originalPath.startsWith('/')) {
            paths.push('/' + originalPath);
        }
        
        // Try with and without /spotideals.github.io prefix
        if (!originalPath.includes('/spotideals.github.io/')) {
            if (originalPath.startsWith('/')) {
                paths.push('/spotideals.github.io' + originalPath);
            } else {
                paths.push('/spotideals.github.io/' + originalPath);
            }
        }
        
        return paths;
    }
    
    // Fix an image source if needed
    async function fixImageSource(img) {
        const originalSrc = img.getAttribute('src');
        const hasSrcset = img.hasAttribute('srcset');
        
        console.log(`Testing image: ${originalSrc}`);
        
        // Skip if it's a data URL or absolute URL
        if (originalSrc.startsWith('data:') || originalSrc.startsWith('http')) {
            return;
        }
        
        // Check if original source loads
        const originalWorks = await testAsset(originalSrc);
        if (originalWorks) {
            console.log(`Image loads correctly: ${originalSrc}`);
            return;
        }
        
        console.log(`Image failed to load: ${originalSrc}, trying alternatives`);
        
        // Try alternative paths
        const alternativePaths = getAlternativePaths(originalSrc);
        
        for (const path of alternativePaths) {
            const works = await testAsset(path);
            if (works) {
                console.log(`Found working alternative: ${path}`);
                img.src = path;
                
                // If there's a srcset, adjust it too using the same fix pattern
                if (hasSrcset && img.parentElement.tagName.toLowerCase() === 'picture') {
                    const sources = img.parentElement.querySelectorAll('source');
                    sources.forEach(source => {
                        const srcset = source.getAttribute('srcset');
                        if (srcset) {
                            const originalPath = srcset;
                            const alternatives = getAlternativePaths(originalPath);
                            
                            // Just use the same pattern that worked for the img src
                            if (originalSrc.startsWith('/') && !path.startsWith('/')) {
                                source.setAttribute('srcset', srcset.substring(1));
                            } else if (!originalSrc.startsWith('/') && path.startsWith('/')) {
                                source.setAttribute('srcset', '/' + srcset);
                            } else if (path.includes('/spotideals.github.io/')) {
                                source.setAttribute('srcset', '/spotideals.github.io/' + srcset.replace(/^\//, ''));
                            }
                        }
                    });
                }
                
                return;
            }
        }
        
        console.error(`Could not find a working path for image: ${originalSrc}`);
    }
    
    // Process all images on the page
    async function processAllImages() {
        const images = document.querySelectorAll('img');
        console.log(`Found ${images.length} images to verify`);
        
        for (const img of images) {
            await fixImageSource(img);
        }
        
        console.log('Image verification complete');
    }
    
    // Fix background images in CSS
    function fixBackgroundImages() {
        // Only needed on GitHub Pages
        if (!isGitHubPages()) return;
        
        // Create a style override if needed
        const style = document.createElement('style');
        style.textContent = `
        /* Path fixes for GitHub Pages */
        .hero {
            background-image: url('./images/hero-background.svg') !important;
        }
        .wave-bg::before, .wave-bg::after {
            background-image: url('./images/webp/hero-background.webp') !important;
        }
        .profile-with-avatar::before {
            background-image: url('./images/avatar-1.svg') !important;
        }
        `;
        document.head.appendChild(style);
        
        console.log('Added CSS overrides for background images');
    }
    
    // Start verification process
    if (isGitHubPages()) {
        console.log('Running on GitHub Pages, starting asset verification');
        processAllImages();
        fixBackgroundImages();
    } else {
        console.log('Not running on GitHub Pages, skipping asset verification');
    }
});
