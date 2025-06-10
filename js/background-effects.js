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
    
    // Créer les particules pour les sections avec des effets
    createParticles('hero-particles', heroParticleCount);
    createParticles('process-particles', processParticleCount);
    
    // Ajouter l'effet de lumière qui suit le curseur uniquement sur desktop
    if (!isMobile) {
        addGlowEffect();
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
