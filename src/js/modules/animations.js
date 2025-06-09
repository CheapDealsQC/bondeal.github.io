'use strict';

/**
 * Animate elements on scroll using Intersection Observer.
 *
 * Add the `data-reveal` attribute to any element you want to animate.
 * The animation is defined by the `.reveal` class in CSS.
 *
 * Optional: Add `data-reveal-delay` (e.g., "200ms") or
 * `data-reveal-threshold` (e.g., "0.1") to customize.
 */
export function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    if (revealElements.length === 0) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.revealDelay || '0s';
                entry.target.style.transitionDelay = delay;
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Default threshold
    });

    revealElements.forEach(elem => {
        const threshold = parseFloat(elem.dataset.revealThreshold) || 0.1;
        // This is a limitation: the observer has one threshold.
        // For multiple thresholds, multiple observers are needed.
        // For this project, one is sufficient.
        revealObserver.observe(elem);
    });
}

export function initHeroParallax() {
    const heroVisual = document.querySelector('.hero__visual');
    if (!heroVisual) return;

    const onScroll = () => {
        const scrollY = window.scrollY;
        // Apply a gentle parallax effect. Adjust the divisor for more/less effect.
        heroVisual.style.transform = `translateY(${scrollY * 0.1}px)`;
    };

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(onScroll);
    }, { passive: true });
} 