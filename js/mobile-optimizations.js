/* 
 * Mobile Performance Optimizations - SpotiDeals
 * This script implements advanced mobile performance optimizations
 * to improve website loading times and interaction on mobile devices.
 */

document.addEventListener('DOMContentLoaded', function() {
    initMobileOptimizations();
});

/**
 * Initialize mobile-specific performance optimizations
 */
function initMobileOptimizations() {
    // Check if we're on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    if (isMobile) {
        // Apply mobile-specific optimizations
        applyMobileOptimizations();
    }
    
    // Also check on resize (for tablets that can switch orientation)
    window.addEventListener('resize', debounce(function() {
        const nowMobile = window.innerWidth < 768;
        
        if (nowMobile && !isMobile) {
            applyMobileOptimizations();
        }
    }, 250));
}

/**
 * Apply specific optimizations for mobile devices
 */
function applyMobileOptimizations() {
    // 1. Add will-change properties selectively to improve GPU acceleration
    optimizeGPUAcceleration();
    
    // 2. Reduce animation complexity
    reduceAnimationComplexity();
    
    // 3. Implement lazy loading for non-critical elements
    setupLazyLoading();
    
    // 4. Optimize background effects
    optimizeBackgroundEffects();
    
    // 5. Implement content visibility for off-screen content
    setupContentVisibility();
    
    // 6. Optimize parallax effects for mobile
    optimizeParallaxEffects();
    
    // Log optimization applied
    console.log('✅ Mobile optimizations applied');
}

/**
 * Optimize GPU acceleration for critical animations
 */
function optimizeGPUAcceleration() {
    // Select elements that benefit from GPU acceleration
    const animatedElements = document.querySelectorAll('.btn-cta, .price-card, .testimonial-card, .faq-item');
    
    // Add hero parallax elements
    const parallaxElements = document.querySelectorAll('.parallax-layer, .hero-content-enhanced, .spotify-element, .note-element');
    const allAnimatedElements = [...animatedElements, ...parallaxElements];
    
    allAnimatedElements.forEach(element => {
        element.style.willChange = 'transform';
        
        // Remove will-change after animations complete to free GPU memory
        element.addEventListener('transitionend', function() {
            this.style.willChange = 'auto';
        }, { once: true });
    });
}

/**
 * Reduce animation complexity for better mobile performance
 */
function reduceAnimationComplexity() {
    // Simplify animations that are too intensive for mobile
    document.documentElement.classList.add('mobile-optimized');
    
    // Reduce animation duration
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 767px) {
            :root {
                --transition: 0.2s ease !important;
                --transition-slow: 0.3s ease !important;
            }
            
            .animate-on-scroll {
                transition-duration: 0.3s !important;
            }
            
            .testimonial-card, .price-card, .faq-item {
                transition-duration: 0.2s !important;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Setup lazy loading for non-critical elements
 */
function setupLazyLoading() {
    // Add lazy loading to images that don't have it yet
    const images = document.querySelectorAll('img:not([loading="lazy"])');
    images.forEach(img => {
        if (!img.closest('.hero') && !img.closest('header')) {
            img.setAttribute('loading', 'lazy');
        }
    });
    
    // Also lazy load background images in sections
    const sectionsWithBg = document.querySelectorAll('.section:not(.hero)');
    sectionsWithBg.forEach((section, index) => {
        if (index > 1) { // Skip first two sections
            section.classList.add('lazy-background');
        }
    });
}

/**
 * Optimize background effects for mobile
 */
function optimizeBackgroundEffects() {
    // Reduce particle count for mobile
    if (typeof window.reduceParticleCount === 'function') {
        window.reduceParticleCount(true);
    }
    
    // Simplify wave animations
    const waveBgs = document.querySelectorAll('.wave-bg');
    waveBgs.forEach(wave => {
        wave.classList.add('mobile-simplified');
    });
}

/**
 * Setup content-visibility for off-screen sections to improve rendering performance
 */
function setupContentVisibility() {
    // Use content-visibility CSS property for sections that are initially off-screen
    const sections = document.querySelectorAll('.section');
    
    // Skip the first two visible sections
    for (let i = 2; i < sections.length; i++) {
        sections[i].style.contentVisibility = 'auto';
        sections[i].style.containIntrinsicSize = '0 500px'; // Estimate height
    }
}

/**
 * Optimize parallax effects for better mobile performance
 */
function optimizeParallaxEffects() {
    // Check if the parallax elements exist
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    if (parallaxLayers.length === 0) return;
    
    // For very low-end devices, disable parallax completely
    const isLowEndDevice = isLowPerformanceDevice();
    
    if (isLowEndDevice) {
        // Remove parallax effects completely on very low-end devices
        document.documentElement.classList.add('reduced-motion');
        
        // Add static positioning for better performance
        parallaxLayers.forEach(layer => {
            layer.style.transform = 'none';
            layer.style.transition = 'none';
        });
        
        console.log('Parallax effects disabled for low-end mobile device');
    } else {
        // For mid-range devices, reduce parallax sensitivity
        parallaxLayers.forEach(layer => {
            // Reduce the speed factor by half for mobile
            const currentSpeed = parseFloat(layer.dataset.speed) || 0.05;
            const currentScroll = parseFloat(layer.dataset.scroll) || 0.1;
            
            layer.dataset.speed = (currentSpeed / 2).toString();
            layer.dataset.scroll = (currentScroll / 2).toString();
        });
        
        // Reduce floating elements animation complexity
        const floatingElements = document.querySelectorAll('.spotify-element, .note-element');
        floatingElements.forEach(element => {
            // Simplify animations by making them longer and less intensive
            const currentAnimation = element.style.animation;
            if (currentAnimation && currentAnimation.includes('float')) {
                // Extract the duration and apply a longer one
                const durationMatch = currentAnimation.match(/float\s+(\d+)s/);
                if (durationMatch && durationMatch[1]) {
                    const newDuration = parseInt(durationMatch[1]) * 1.5; // 50% longer
                    element.style.animation = currentAnimation.replace(
                        /float\s+\d+s/, 
                        `float ${newDuration}s`
                    );
                }
            }
        });
        
        console.log('Parallax effects optimized for mobile');
    }
}

/**
 * Simple debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Detect if the device is likely a low-performance device
 * Uses heuristics like memory, CPU cores, and user agent
 * @return {boolean} True if device is likely low-performance
 */
function isLowPerformanceDevice() {
    // Check for deviceMemory API support (Chrome)
    if (navigator.deviceMemory !== undefined) {
        if (navigator.deviceMemory < 2) {
            return true; // Less than 2GB RAM is considered low-end
        }
    }
    
    // Check for hardwareConcurrency API (CPU cores)
    if (navigator.hardwareConcurrency !== undefined) {
        if (navigator.hardwareConcurrency < 4) {
            return true; // Less than 4 cores is considered low-end
        }
    }
    
    // Check for older devices by user agent
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Older iPhone models (before iPhone 8)
    if (/iphone/.test(userAgent) && !(/iphone 8/.test(userAgent) || /iphone 9/.test(userAgent) || 
        /iphone 10/.test(userAgent) || /iphone 11/.test(userAgent) || /iphone 12/.test(userAgent) ||
        /iphone 13/.test(userAgent) || /iphone 14/.test(userAgent) || /iphone 15/.test(userAgent))) {
        return true;
    }
    
    // Check for Android version
    const androidVersionMatch = userAgent.match(/android\s([0-9\.]*)/);
    if (androidVersionMatch && parseFloat(androidVersionMatch[1]) < 7) {
        return true; // Android version < 7 is considered low-end
    }
    
    // Check for budget Android device keywords
    const budgetAndroidKeywords = ['sm-j', 'sm-g5', 'sm-a3', 'redmi', 'note 5', 'moto g'];
    for (const keyword of budgetAndroidKeywords) {
        if (userAgent.includes(keyword)) {
            return true;
        }
    }
    
    return false;
}
