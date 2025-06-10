// Testimonials Enhanced Animation - SpotiDeals

document.addEventListener('DOMContentLoaded', function() {
    initTestimonialAnimations();
});

/**
 * Initialize enhanced testimonial animations and interactions
 */
function initTestimonialAnimations() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    // Skip if no testimonial cards found
    if (!testimonialCards.length) return;
    
    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Setup observer for testimonial animations
    const testimonialsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                testimonialsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Apply observer to each card
    testimonialCards.forEach(card => {
        testimonialsObserver.observe(card);
        
        // Add tilt effect on desktop if motion is not reduced
        if (!prefersReducedMotion && window.innerWidth > 768) {
            enableTiltEffect(card);
        }
    });
    
    // Handle window resize for responsive behavior
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth <= 768 || prefersReducedMotion) {
            testimonialCards.forEach(card => {
                card.removeEventListener('mousemove', handleTilt);
                card.removeEventListener('mouseleave', resetTilt);
                card.style.transform = '';
            });
        } else {
            testimonialCards.forEach(card => {
                enableTiltEffect(card);
            });
        }
    }, 250));
}

/**
 * Enable the tilting effect on a card element
 * @param {HTMLElement} element - The card element to add tilt to
 */
function enableTiltEffect(element) {
    element.addEventListener('mousemove', handleTilt);
    element.addEventListener('mouseleave', resetTilt);
}

/**
 * Handle the tilt effect based on mouse position
 * @param {Event} e - The mouse event
 */
function handleTilt(e) {
    const card = this;
    const cardRect = card.getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate tilt values (max 5 degrees)
    const tiltX = (mouseY / (cardRect.height / 2)) * 5;
    const tiltY = -(mouseX / (cardRect.width / 2)) * 5;
    
    // Apply the transform with subtle animation
    card.style.transition = 'transform 0.1s ease-out';
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
}

/**
 * Reset the tilt effect when mouse leaves
 */
function resetTilt() {
    this.style.transition = 'transform 0.5s ease-out';
    this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
}

/**
 * Simple debounce function for performance optimization
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
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
