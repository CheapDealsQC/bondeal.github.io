// Hero Parallax Effects for SpotiDeals

document.addEventListener('DOMContentLoaded', function() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Don't initialize parallax effects for users who prefer reduced motion
        document.documentElement.classList.add('reduced-motion');
        return;
    }
    
    // Device detection
    const isMobile = window.innerWidth <= 768;
    
    // Create floating elements for the parallax effect
    createFloatingElements();
    
    // Enable parallax effect
    initParallax();
    
    // Handle scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const targetSection = document.getElementById('comment-ca-marche');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        // Hide scroll indicator when scrolling down
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '0.7';
            }
        });
    }
    
    // Initialize 3D tilt effect for premium card
    if (!isMobile) {
        const heroContent = document.querySelector('.hero-content-enhanced');
        if (heroContent) {
            heroContent.addEventListener('mousemove', function(e) {
                const rect = heroContent.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Calculate tilt values (limited tilt amount)
                const tiltX = (y / rect.height - 0.5) * 5;
                const tiltY = (x / rect.width - 0.5) * -5;
                
                heroContent.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
            });
            
            heroContent.addEventListener('mouseleave', function() {
                heroContent.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        }
    }
    
    // Premium text effect
    const premiumText = document.querySelectorAll('.premium-text');
    if (premiumText.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        premiumText.forEach(text => {
            observer.observe(text);
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        const newIsMobile = window.innerWidth <= 768;
        
        // Reinitialize only if device category changes
        if (isMobile !== newIsMobile) {
            // Remove existing elements
            document.querySelectorAll('.spotify-element, .note-element').forEach(el => {
                el.remove();
            });
            
            // Recreate with new device settings
            createFloatingElements();
        }
    }, 250));
});

/**
 * Initialize parallax effect on scroll and mouse movement
 */
function initParallax() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const heroSection = document.querySelector('.hero-enhanced');
    
    if (!parallaxLayers.length || !heroSection) return;
    
    // Parallax on mouse movement
    document.addEventListener('mousemove', function(e) {
        // Calculate mouse position relative to the center of the screen
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        parallaxLayers.forEach(layer => {
            const speedFactor = layer.dataset.speed || 0.05;
            const xOffset = mouseX * 100 * speedFactor;
            const yOffset = mouseY * 50 * speedFactor;
            
            layer.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
    
    // Parallax on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const heroTop = heroSection.offsetTop;
        const relativeScroll = scrollTop - heroTop;
        
        if (relativeScroll >= 0 && relativeScroll <= heroSection.offsetHeight) {
            parallaxLayers.forEach(layer => {
                const scrollFactor = layer.dataset.scroll || 0.1;
                const yOffset = relativeScroll * scrollFactor;
                
                // Extract existing translation from mousemove
                const currentTransform = layer.style.transform;
                const translateX = currentTransform.includes('translate(') ? 
                    parseFloat(currentTransform.split('translate(')[1]) : 0;
                
                layer.style.transform = `translate(${translateX}px, ${yOffset}px)`;
            });
        }
    });
}

/**
 * Create floating elements for the parallax hero
 */
function createFloatingElements() {
    const heroSection = document.querySelector('.hero-enhanced');
    const isMobile = window.innerWidth <= 768;
    
    if (!heroSection) return;
    
    // Container for back layer elements
    const backLayer = document.querySelector('.layer-back');
    if (!backLayer) return;
    
    // Container for middle layer elements
    const midLayer = document.querySelector('.layer-mid');
    if (!midLayer) return;
    
    // Container for front layer elements
    const frontLayer = document.querySelector('.layer-front');
    if (!frontLayer) return;
    
    // Create fewer elements on mobile
    const elementsCount = isMobile ? 3 : 6;
    
    // Add Spotify-like circular elements to back layer
    for (let i = 0; i < elementsCount; i++) {
        const element = document.createElement('div');
        element.classList.add('spotify-element');
        
        // Randomize size
        const sizeClasses = ['element-sm', 'element-md', 'element-lg'];
        element.classList.add(sizeClasses[Math.floor(Math.random() * sizeClasses.length)]);
        
        // Randomize color
        const colorClasses = ['element-primary', 'element-secondary', 'element-accent'];
        element.classList.add(colorClasses[Math.floor(Math.random() * colorClasses.length)]);
        
        // Random position
        element.style.left = `${Math.random() * 80 + 10}%`;
        element.style.top = `${Math.random() * 80 + 10}%`;
        
        // Add subtle animation
        element.style.animation = `float ${20 + Math.random() * 20}s infinite ease-in-out ${Math.random() * 5}s`;
        
        backLayer.appendChild(element);
    }
    
    // Add musical note elements to mid layer
    if (!isMobile) {
        for (let i = 0; i < Math.floor(elementsCount / 2); i++) {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note-element');
            
            // Create SVG musical note
            noteElement.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 17V5.8C9 5.51997 9 5.37996 9.0545 5.273C9.10243 5.17892 9.17892 5.10243 9.273 5.0545C9.37996 5 9.51997 5 9.8 5H14.2C14.48 5 14.62 5 14.727 5.0545C14.8211 5.10243 14.8976 5.17892 14.9455 5.273C15 5.37996 15 5.51997 15 5.8V17.5C15 19.7091 13.2091 21.5 11 21.5C8.79086 21.5 7 19.7091 7 17.5C7 15.2909 8.79086 13.5 11 13.5C11.4142 13.5 11.8 13.5 12 13.5" 
                    stroke="rgba(29, 185, 84, 0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
            // Random position
            noteElement.style.left = `${Math.random() * 90 + 5}%`;
            noteElement.style.top = `${Math.random() * 90 + 5}%`;
            
            // Add animation
            noteElement.style.animation = `float ${15 + Math.random() * 15}s infinite ease-in-out ${Math.random() * 5}s`;
            
            midLayer.appendChild(noteElement);
        }
    }
    
    // Add equalizer-like visualizer elements to front layer
    if (!isMobile) {
        // Create visualization dots
        for (let i = 0; i < 10; i++) {
            const dot = document.createElement('div');
            dot.classList.add('visualization-dot');
            
            // Position along bottom edge
            dot.style.left = `${10 + (i * 8)}%`;
            dot.style.bottom = `${10 + Math.random() * 5}%`;
            
            // Pulsing animation
            dot.style.animation = `pulse ${1 + Math.random() * 0.5}s infinite alternate ${Math.random() * 0.5}s`;
            
            frontLayer.appendChild(dot);
        }
        
        // Create visualization bars
        for (let i = 0; i < 5; i++) {
            const bar = document.createElement('div');
            bar.classList.add('visualization-bar');
            
            // Position in bottom right corner
            bar.style.right = `${10 + (i * 10)}%`;
            bar.style.bottom = `10%`;
            
            // Scale animation
            bar.style.animation = `scaleHeight ${1 + Math.random() * 0.5}s infinite alternate ${Math.random() * 0.5}s`;
            
            frontLayer.appendChild(bar);
        }
    }
}

/**
 * Debounce helper function
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Add keyframe animations for visualization elements
(function addKeyframes() {
    const style = document.createElement('style');
    
    style.textContent = `
        @keyframes scaleHeight {
            0% { transform: scaleY(0.3); }
            100% { transform: scaleY(1); }
        }
    `;
    
    document.head.appendChild(style);
})();
