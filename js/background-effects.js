// Effets de background pour SpotiDeals - Optimisé pour la performance

document.addEventListener('DOMContentLoaded', function() {
    // Optimisation : Vérifier si la préférence de réduction de mouvement est activée
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Désactiver totalement les effets animés pour les utilisateurs qui préfèrent réduire les mouvements
        disableAllEffects();
        return;
    }
    
    // Détection du type d'appareil pour optimisations
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    // Ajuster le nombre de particules en fonction du type d'appareil
    const heroParticleCount = isSmallMobile ? 2 : (isMobile ? 4 : 10);
    const processParticleCount = isSmallMobile ? 3 : (isMobile ? 6 : 15);
    
    // Exposer la fonction de réduction de particules pour l'optimisation mobile
    window.reduceParticleCount = function(forceMobile) {
        if (forceMobile || isMobile) {
            // Réduire le nombre de particules existantes
            document.querySelectorAll('.particles-container').forEach(container => {
                const particles = container.querySelectorAll('.particle');
                // Garder seulement la moitié des particules
                for (let i = 0; i < particles.length; i++) {
                    if (i % 2 === 0) {
                        particles[i].remove();
                    }
                }
            });
            
            // Appliquer des optimisations CSS supplémentaires
            const style = document.createElement('style');
            style.textContent = `
                .particle {
                    animation-duration: 60s !important; /* Ralentir pour économiser la CPU */
                }
                .wave-bg::before, .wave-bg::after {
                    animation-duration: 90s !important;
                }
            `;
            document.head.appendChild(style);
            
            console.log('Particle count reduced for mobile optimization');
        }
    };
      // Créer les particules pour les sections avec des effets
    createParticles('hero-particles', heroParticleCount);
    createParticles('process-particles', processParticleCount);
    
    // Ajouter l'effet de lumière qui suit le curseur uniquement sur desktop
    if (!isMobile) {
        addGlowEffect();
    }
    
    // Détecter le thème sombre et adapter les effets
    if (document.documentElement.classList.contains('dark-theme')) {
        enhanceParticlesForDarkTheme();
    }
    
    // Réinitialiser les effets lors du redimensionnement de la fenêtre
    window.addEventListener('resize', debounce(function() {
        const newIsMobile = window.innerWidth <= 768;
        const newIsSmallMobile = window.innerWidth <= 480;
        
        // Ne réinitialiser que si la catégorie d'appareil change
        if (isMobile !== newIsMobile || isSmallMobile !== newIsSmallMobile) {
            const heroCount = newIsSmallMobile ? 3 : (newIsMobile ? 5 : 10);
            const processCount = newIsSmallMobile ? 4 : (newIsMobile ? 8 : 15);
            
            createParticles('hero-particles', heroCount);
            createParticles('process-particles', processCount);
            
            // Gérer l'effet lumineux
            const glowElement = document.querySelector('.glow-effect');
            if (newIsMobile && glowElement) {
                glowElement.remove();
            } else if (!newIsMobile && !glowElement) {
                addGlowEffect();
            }
        }
    }, 250));
});

/**
 * Crée des particules pour un effet visuel subtil
 * @param {string} containerId - ID du conteneur
 * @param {number} count - Nombre de particules à créer
 */
function createParticles(containerId, count) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Nettoyer le conteneur
    container.innerHTML = '';
    
    // Créer les particules
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Déterminer la taille de la particule
        const sizeClass = getRandomSize();
        particle.classList.add(sizeClass);
        
        // Positionner aléatoirement
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Ajouter un délai pour l'animation
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        // Ajouter la particule au conteneur
        container.appendChild(particle);
    }
}

/**
 * Renvoie une classe de taille aléatoire pour les particules
 */
function getRandomSize() {
    const sizes = ['particle-sm', 'particle-md', 'particle-lg'];
    const index = Math.floor(Math.random() * sizes.length);
    return sizes[index];
}

/**
 * Ajoute un effet lumineux qui suit le curseur
 */
function addGlowEffect() {
    const glow = document.createElement('div');
    glow.classList.add('glow-effect');
    document.body.appendChild(glow);
    
    // Alterner entre les couleurs
    let isBlue = false;
    
    // Suivre le curseur
    document.addEventListener('mousemove', function(e) {
        const x = e.clientX;
        const y = e.clientY;
        
        // Mettre à jour la position
        glow.style.left = `${x - 75}px`;
        glow.style.top = `${y - 75}px`;
        glow.style.opacity = '1';
        
        // Changer la couleur sur les sections principales
        const section = getElementAtPoint(x, y, '.section');
        if (section) {
            if (section.id === 'process' || section.id === 'comment-ca-marche') {
                if (!isBlue) {
                    glow.classList.add('glow-blue');
                    isBlue = true;
                }
            } else {
                if (isBlue) {
                    glow.classList.remove('glow-blue');
                    isBlue = false;
                }
            }
        }
    });
    
    // Cacher l'effet quand le curseur quitte la fenêtre
    document.addEventListener('mouseleave', function() {
        glow.style.opacity = '0';
    });
}

/**
 * Obtient l'élément correspondant au sélecteur sous le pointeur
 * @param {number} x - Position X
 * @param {number} y - Position Y
 * @param {string} selector - Sélecteur CSS
 */
function getElementAtPoint(x, y, selector) {
    const element = document.elementFromPoint(x, y);
    if (!element) return null;
    
    return element.closest(selector);
}

/**
 * Fonction debounce pour limiter le nombre d'appels de fonction
 * @param {Function} func - Fonction à exécuter
 * @param {number} wait - Temps d'attente en millisecondes
 */
function debounce(func, wait = 200) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Désactive tous les effets d'arrière-plan pour les utilisateurs
 * qui préfèrent une expérience sans animation
 */
function disableAllEffects() {
    // Supprimer les conteneurs de particules
    const particlesContainers = document.querySelectorAll('.particles-container');
    particlesContainers.forEach(container => {
        container.innerHTML = '';
        container.style.display = 'none';
    });
    
    // Supprimer les effets d'onde
    const waveBgs = document.querySelectorAll('.wave-bg');
    waveBgs.forEach(wave => {
        wave.style.display = 'none';
    });
    
    // Supprimer les classes de gradient pour les textes
    const gradientTexts = document.querySelectorAll('.gradient-text');
    gradientTexts.forEach(text => {
        text.classList.remove('gradient-text');
    });
    
    // S'assurer que tous les éléments avec animation sont visibles
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
        element.classList.add('is-visible');
        element.style.opacity = '1';
        element.style.transform = 'none';
    });
    
    // Améliorer la performance globale
    document.documentElement.classList.add('reduced-motion');
}

/**
 * Améliore les effets de particules pour le thème sombre
 */
function enhanceParticlesForDarkTheme() {
    // Sélectionner toutes les particules
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach(particle => {
        // Augmenter légèrement l'opacité pour une meilleure visibilité sur fond sombre
        particle.style.opacity = '0.2';
        
        // Appliquer des effets de flou et de luminosité pour un look plus brillant
        particle.style.filter = 'blur(1px) brightness(1.3)';
        
        // Ajouter un léger halo pour un effet plus lumineux
        particle.style.boxShadow = '0 0 10px rgba(29, 185, 84, 0.2)';
        
        // Ajuster le dégradé de couleur pour qu'il soit plus visible et rappelle Spotify
        if (Math.random() > 0.5) {
            particle.style.background = 'linear-gradient(135deg, rgba(29, 185, 84, 0.7), rgba(67, 130, 255, 0.6))';
        } else {
            particle.style.background = 'linear-gradient(135deg, rgba(67, 130, 255, 0.7), rgba(29, 185, 84, 0.6))';
        }
    });
    
    // Améliorer l'effet des vagues pour le thème sombre
    const waveBgs = document.querySelectorAll('.wave-bg');
    waveBgs.forEach(waveBg => {
        const before = document.createElement('style');
        before.textContent = `
            .wave-bg::before {
                background: linear-gradient(135deg, rgba(29, 185, 84, 0.05), rgba(67, 130, 255, 0.05));
                opacity: 0.1;
            }
            
            .wave-bg::after {
                background: linear-gradient(135deg, rgba(67, 130, 255, 0.05), rgba(29, 185, 84, 0.05));
                opacity: 0.15;
            }
        `;
        document.head.appendChild(before);
    });
    
    // Améliorer l'effet de brillance
    enhanceGlowForDarkTheme();
}

/**
 * Améliore l'effet de brillance pour le thème sombre
 */
function enhanceGlowForDarkTheme() {
    // Sélectionner l'effet de brillance s'il existe
    const glowEffect = document.querySelector('.glow-effect');
    
    if (!glowEffect) return;
    
    // Augmenter l'intensité et le flou pour un effet plus prononcé sur fond sombre
    glowEffect.style.filter = 'blur(30px)';
    glowEffect.style.backgroundImage = 'radial-gradient(circle, rgba(29, 185, 84, 0.4), transparent 70%)';
    
    // Ajouter des classes pour différents effets de couleur
    glowEffect.classList.add('dark-theme-glow');
    
    // Créer une nouvelle règle CSS pour les variations de couleur
    const style = document.createElement('style');
    style.textContent = `
        .glow-effect.dark-theme-glow {
            mix-blend-mode: screen;
            z-index: 2;
        }
        
        .glow-effect.dark-theme-glow.glow-green {
            background-image: radial-gradient(circle, rgba(29, 185, 84, 0.5), transparent 70%);
        }
        
        .glow-effect.dark-theme-glow.glow-blue {
            background-image: radial-gradient(circle, rgba(67, 130, 255, 0.5), transparent 70%);
        }
    `;
    document.head.appendChild(style);
    
    // Modifier le comportement du suivi de souris pour varier les couleurs
    document.addEventListener('mousemove', function(e) {
        // Ne pas modifier s'il n'y a pas d'effet de brillance
        if (!document.querySelector('.glow-effect.dark-theme-glow')) return;
        
        // Changer les couleurs en fonction des éléments survolés
        const hoverElement = document.elementFromPoint(e.clientX, e.clientY);
        if (hoverElement) {
            // Vérifier le type d'élément pour changer la couleur de l'effet
            if (hoverElement.closest('.btn-cta') || 
                hoverElement.closest('.feature-icon') ||
                hoverElement.closest('.price-card-premium')) {
                glowEffect.classList.add('glow-green');
                glowEffect.classList.remove('glow-blue');
            } 
            else if (hoverElement.closest('a') || 
                    hoverElement.closest('.form-control') ||
                    hoverElement.closest('.testimonial-card')) {
                glowEffect.classList.add('glow-blue');
                glowEffect.classList.remove('glow-green');
            }
            else {
                glowEffect.classList.remove('glow-green');
                glowEffect.classList.remove('glow-blue');
            }
        }
    });
}
