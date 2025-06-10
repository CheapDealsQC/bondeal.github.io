/**
 * Theme sombre style Spotify pour SpotiDeals
 * Créé: 10 Juin 2025
 * 
 * Ce script gère les fonctionnalités spécifiques au thème sombre
 * et ajoute des effets visuels inspirés par l'interface Spotify.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les fonctionnalités du thème
    initDarkTheme();
    
    // Si le thème sombre est actif, appliquer les effets spécifiques au thème sombre
    if (document.documentElement.classList.contains('dark-theme')) {
        // Ajouter des effets de survol de style Spotify
        initSpotifyHoverEffects();
        
        // Initialiser la visualisation musicale
        initAudioVisualization();
        
        // Améliorer les effets de particules pour le thème sombre
        if (typeof enhanceParticlesForDarkTheme === 'function') {
            enhanceParticlesForDarkTheme();
        }
    }
    
    // Vérifier si nous sommes sur la page admin
    const isAdminPage = window.location.pathname.includes('admin');
    if (isAdminPage && document.documentElement.classList.contains('dark-theme')) {
        initAdminDarkTheme();
    }
    
    // Toujours initialiser le sélecteur de thème pour permettre le changement
    initThemeToggle();
});

/**
 * Initialise les fonctionnalités du thème sombre
 */
function initDarkTheme() {
    // Vérifier les préférences utilisateur et système
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Appliquer le thème en fonction des préférences
    if (savedTheme === 'dark' || (savedTheme !== 'light' && prefersDark)) {
        // Marquer le document comme utilisant le thème sombre
        document.documentElement.classList.add('dark-theme');
    } else if (savedTheme === 'light') {
        // Respecter la préférence explicite pour le thème clair
        document.documentElement.classList.remove('dark-theme');
        return; // Ne pas continuer si l'utilisateur veut explicitement le thème clair
    }
    
    // Adapter les métadonnées du thème pour les navigateurs mobiles
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#121212');
    } else {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = '#121212';
        document.head.appendChild(meta);
    }
    
    // Ajuster les éléments d'interface pour le thème sombre
    adjustInterfaceForDarkTheme();
}

/**
 * Ajuste certains éléments spécifiques pour le thème sombre
 */
function adjustInterfaceForDarkTheme() {
    // Appliquer des filtres inversés aux images qui ont besoin d'être visibles sur fond sombre
    const logoImages = document.querySelectorAll('.logo img, .footer-logo');
    logoImages.forEach(img => {
        img.style.filter = 'brightness(0) invert(1)';
    });
    
    // Ajuster les icônes pour une meilleure visibilité
    const icons = document.querySelectorAll('.feature-icon i, .faq-question i');
    icons.forEach(icon => {
        icon.style.textShadow = '0 0 10px rgba(29, 185, 84, 0.3)';
    });
    
    // Ajouter un effet subtil de halo aux titres principaux
    const mainTitles = document.querySelectorAll('h1, h2');
    mainTitles.forEach(title => {
        title.style.textShadow = '0 0 20px rgba(29, 185, 84, 0.2)';
    });
}

/**
 * Initialise les effets de survol de style Spotify
 */
function initSpotifyHoverEffects() {
    // Appliquer aux cartes et sections interactives
    const interactiveElements = document.querySelectorAll('.price-card, .feature-item, .testimonial-card, .faq-item');
    
    interactiveElements.forEach(element => {
        // Créer un effet de brillance sur le survol
        element.addEventListener('mouseenter', function(e) {
            if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
                // Ajouter un effet de lueur verte subtil
                this.style.boxShadow = '0 10px 30px rgba(29, 185, 84, 0.15)';
                this.style.borderColor = 'rgba(29, 185, 84, 0.3)';
                
                // Effet sur les icônes si présentes
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.1)';
                    icon.style.color = '#1DB954';
                }
            }
        });
        
        // Réinitialiser les effets
        element.addEventListener('mouseleave', function() {
            // Supprimer l'effet de lueur
            this.style.boxShadow = '';
            this.style.borderColor = '';
            
            // Réinitialiser les icônes
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = '';
                icon.style.color = '';
            }
        });
    });
    
    // Effet spécial pour les boutons CTA
    const ctaButtons = document.querySelectorAll('.btn-cta');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
                // Ajouter un effet de pulsation subtil
                this.animate([
                    { transform: 'scale(1)', boxShadow: '0 6px 12px rgba(29, 185, 84, 0.2)' },
                    { transform: 'scale(1.03)', boxShadow: '0 8px 16px rgba(29, 185, 84, 0.3)' },
                    { transform: 'scale(1)', boxShadow: '0 6px 12px rgba(29, 185, 84, 0.2)' }
                ], {
                    duration: 1000,
                    iterations: Infinity
                });
            }
        });
        
        button.addEventListener('mouseleave', function() {
            // Arrêter toutes les animations
            this.getAnimations().forEach(anim => anim.cancel());
        });
    });
    
    // Effet spécial pour le bouton Commander
    const commanderBtn = document.querySelector('a[href="#commander"].btn-primary');
    if (commanderBtn) {
        // Ajouter une classe de pulsation Spotify
        commanderBtn.classList.add('spotify-pulse');
        
        // Créer un effet de survol plus prononcé
        commanderBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 0 20px rgba(29, 185, 84, 0.4)';
        });
        
        commanderBtn.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    }
    
    // Effet spécial pour les titres importants
    const mainHeadings = document.querySelectorAll('h1, h2');
    mainHeadings.forEach(heading => {
        heading.addEventListener('mouseenter', function() {
            if (!this.classList.contains('no-effect') && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
                this.classList.add('neon-text');
                
                // Effet de distorsion subtil
                this.animate([
                    { transform: 'skew(0deg)' },
                    { transform: 'skew(0.3deg)' },
                    { transform: 'skew(-0.3deg)' },
                    { transform: 'skew(0deg)' }
                ], {
                    duration: 200,
                    iterations: 1
                });
            }
        });
        
        heading.addEventListener('mouseleave', function() {
            this.classList.remove('neon-text');
        });
    });
}

/**
 * Initialise l'effet de visualisation audio inspiré par Spotify
 */
function initAudioVisualization() {
    // Vérifier si la section héro existe
    const heroSection = document.querySelector('.hero-enhanced');
    if (!heroSection) return;
    
    // Vérifier la préférence de réduction de mouvement
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    // Créer un conteneur pour la visualisation
    const visualizerContainer = document.createElement('div');
    visualizerContainer.className = 'audio-visualizer';
    visualizerContainer.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding: 0 20px;
        z-index: 5;
        pointer-events: none;
    `;
    
    // Créer les barres de visualisation
    const barCount = window.innerWidth < 768 ? 15 : 30;
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        bar.style.cssText = `
            width: 3px;
            height: 5px;
            margin: 0 2px;
            background-color: rgba(29, 185, 84, 0.6);
            border-radius: 2px 2px 0 0;
            transition: height 0.1s ease;
        `;
        visualizerContainer.appendChild(bar);
        
        // Animation pour simuler la visualisation audio
        animateBar(bar);
    }
    
    // Ajouter la visualisation à la section héro
    heroSection.appendChild(visualizerContainer);
}

/**
 * Anime une barre de visualisation pour simuler de la musique
 */
function animateBar(bar) {
    // Générer une hauteur aléatoire basée sur une distribution qui simule un spectre audio
    const getRandomHeight = () => {
        // Distribution normale centrée autour de 15px avec un écart-type de 10px
        const height = Math.max(5, Math.min(40, Math.random() * 20 + 5));
        return height;
    };
    
    // Animer en continu avec des intervalles légèrement aléatoires
    const animate = () => {
        const height = getRandomHeight();
        bar.style.height = `${height}px`;
        
        // Ajuster la couleur en fonction de la hauteur (plus haut = plus lumineux)
        const opacity = 0.4 + (height / 40) * 0.6;
        bar.style.backgroundColor = `rgba(29, 185, 84, ${opacity})`;
        
        // Programmer la prochaine animation avec un léger délai aléatoire
        setTimeout(animate, 100 + Math.random() * 200);
    };
    
    // Démarrer l'animation avec un délai initial aléatoire
    setTimeout(animate, Math.random() * 500);
}

/**
 * Sélection aléatoire dans un tableau
 */
function getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Détecter les changements de préférences d'animation
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) {
        // L'utilisateur préfère maintenant réduire les animations
        document.querySelectorAll('.audio-visualizer').forEach(el => el.remove());
    } else {
        // L'utilisateur accepte maintenant les animations
        initAudioVisualization();
    }
});

/**
 * Initialise le thème sombre spécifique à l'administration
 */
function initAdminDarkTheme() {
    // Adapter le tableau de bord pour le thème sombre
    const style = document.createElement('style');
    style.textContent = `
        /* Styles pour le dashboard d'administration */
        .dark-theme .admin-sidebar {
            background-color: var(--dark-bg-secondary);
            border-right: 1px solid var(--dark-border);
        }
        
        .dark-theme .admin-content {
            background-color: var(--dark-bg);
        }
        
        .dark-theme .admin-header {
            background-color: var(--dark-bg-secondary);
            border-bottom: 1px solid var(--dark-border);
        }
        
        .dark-theme .admin-card {
            background-color: var(--dark-bg-tertiary);
            border: 1px solid var(--dark-border);
        }
        
        .dark-theme .data-table {
            color: var(--dark-text);
        }
        
        .dark-theme .data-table th {
            background-color: var(--dark-bg-tertiary);
            color: var(--dark-text);
            border-bottom: 2px solid var(--dark-border);
        }
        
        .dark-theme .data-table td {
            border-bottom: 1px solid var(--dark-border);
        }
        
        .dark-theme .data-table tbody tr:hover {
            background-color: rgba(255, 255, 255, 0.05);
        }
        
        .dark-theme .admin-nav-item {
            color: var(--dark-text-secondary);
        }
        
        .dark-theme .admin-nav-item:hover,
        .dark-theme .admin-nav-item.active {
            background-color: rgba(29, 185, 84, 0.1);
            color: var(--spotify-green);
        }
        
        .dark-theme .status-badge {
            border: 1px solid var(--dark-border);
        }
        
        .dark-theme .status-pending {
            background-color: rgba(255, 183, 77, 0.2);
        }
        
        .dark-theme .status-processing {
            background-color: rgba(67, 130, 255, 0.2);
        }
        
        .dark-theme .status-completed {
            background-color: rgba(29, 185, 84, 0.2);
        }
        
        .dark-theme .status-refunded {
            background-color: rgba(229, 57, 53, 0.2);
        }
        
        .dark-theme .chart-container {
            background-color: var(--dark-bg-tertiary);
            border: 1px solid var(--dark-border);
            border-radius: var(--border-radius);
            padding: 1rem;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialise un sélecteur de thème clair/sombre
 */
function initThemeToggle() {
    // Créer le bouton de bascule de thème
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
        <button id="theme-toggle-btn" aria-label="Changer de thème">
            <i class="fas fa-moon"></i>
        </button>
    `;
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
    `;
    
    // Style pour le bouton
    const toggleBtn = themeToggle.querySelector('#theme-toggle-btn');
    toggleBtn.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: rgba(29, 185, 84, 0.8);
        color: white;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Ajouter à la page
    document.body.appendChild(themeToggle);
    
    // Vérifier le thème actuel
    const isDarkTheme = document.documentElement.classList.contains('dark-theme');
    
    // Mettre à jour l'icône en fonction du thème actuel
    if (isDarkTheme) {
        toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Gestionnaire de clic pour basculer entre les thèmes
    toggleBtn.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark-theme');
        
        // Mettre à jour l'icône
        const isDark = document.documentElement.classList.contains('dark-theme');
        
        if (isDark) {
            this.innerHTML = '<i class="fas fa-sun"></i>';
            
            // Ajouter une préférence utilisateur
            localStorage.setItem('theme', 'dark');
            
            // Recréer les effets adaptés au thème sombre
            if (typeof enhanceParticlesForDarkTheme === 'function') {
                enhanceParticlesForDarkTheme();
            }
        } else {
            this.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
            
            // Recharger la page pour réinitialiser les effets
            window.location.reload();
        }
    });
    
    // Effet de survol
    toggleBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 0 15px rgba(29, 185, 84, 0.4)';
    });
    
    toggleBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    });
}
