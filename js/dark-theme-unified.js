/**
 * Script de compatibilité maximale pour le thème sombre SpotiDeals
 * Version finale : 10 Juin 2025
 * 
 * Ce script garantit le fonctionnement du thème sombre sur GitHub Pages
 * en utilisant uniquement des chemins relatifs et une approche robuste.
 * 
 * Il combine et remplace les fonctionnalités de dark-theme.js,
 * browser-compatibility.js et asset-path-fix.js.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('SpotiDeals Dark Theme - Loaded Successfully');
    
    // Version du script pour débogage
    const VERSION = '2.0.0';
    
    // Détection de l'environnement
    const isGitHubPages = window.location.hostname.includes('github.io');
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
    const browser = detectBrowser();
    
    // Initialisation du thème
    initDarkTheme();
    
    // Ajout d'un petit indicateur pour débogage (uniquement visible en mode développeur)
    if (isGitHubPages) {
        const debugInfo = document.createElement('div');
        debugInfo.id = 'dark-theme-debug';
        debugInfo.style.cssText = 'position: fixed; bottom: 10px; right: 10px; background: rgba(29,185,84,0.8); color: white; font-size: 10px; padding: 5px; border-radius: 3px; z-index: 9999; opacity: 0.8;';
        debugInfo.innerHTML = `DarkTheme v${VERSION} | ${browser.name} | ${isMobile ? 'Mobile' : 'Desktop'}`;
        document.body.appendChild(debugInfo);
    }
    
    /**
     * Initialise le thème sombre
     */
    function initDarkTheme() {
        // Vérifier les préférences utilisateur et système
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Appliquer le thème en fonction des préférences
        if (savedTheme === 'dark' || (savedTheme !== 'light' && prefersDark)) {
            document.documentElement.classList.add('dark-theme');
        }
        
        // Créer le bouton de basculement du thème s'il n'existe pas déjà
        if (!document.getElementById('theme-toggle')) {
            createThemeToggle();
        }
        
        // Appliquer les optimisations spécifiques au navigateur
        applyBrowserSpecificFixes(browser);
        
        // Corriger les chemins des images si nécessaire
        if (isGitHubPages) {
            fixImagePaths();
        }
    }
    
    /**
     * Crée le bouton de basculement du thème
     */
    function createThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.className = 'theme-toggle-btn';
        themeToggle.setAttribute('aria-label', 'Basculer entre thème clair et sombre');
        
        // Icône du bouton (lune/soleil)
        themeToggle.innerHTML = document.documentElement.classList.contains('dark-theme') 
            ? '☀️' 
            : '🌙';
        
        // Ajouter au document
        document.body.appendChild(themeToggle);
        
        // Comportement du bouton
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    /**
     * Bascule entre thème clair et sombre
     */
    function toggleTheme() {
        const isDarkTheme = document.documentElement.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        
        // Mettre à jour l'icône
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = isDarkTheme ? '☀️' : '🌙';
        }
    }
    
    /**
     * Détecte le navigateur et sa version
     */
    function detectBrowser() {
        const ua = navigator.userAgent;
        let browserName = "unknown";
        let browserVersion = "unknown";
        
        if (/Chrome/.test(ua) && !/Chromium|Edge|Edg|OPR|Opera/.test(ua)) {
            browserName = "Chrome";
            browserVersion = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || "";
        } else if (/Firefox/.test(ua)) {
            browserName = "Firefox";
            browserVersion = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || "";
        } else if (/Safari/.test(ua) && !/Chrome|Chromium|Edge|Edg|OPR|Opera/.test(ua)) {
            browserName = "Safari";
            browserVersion = ua.match(/Version\/(\d+\.\d+)/)?.[1] || "";
        } else if (/Edg|Edge/.test(ua)) {
            browserName = "Edge";
            browserVersion = ua.match(/Edg(?:e)?\/(\d+\.\d+)/)?.[1] || "";
        } else if (/OPR|Opera/.test(ua)) {
            browserName = "Opera";
            browserVersion = ua.match(/(?:OPR|Opera)\/(\d+\.\d+)/)?.[1] || "";
        }
        
        return { name: browserName, version: browserVersion };
    }
    
    /**
     * Applique des corrections spécifiques au navigateur
     */
    function applyBrowserSpecificFixes(browser) {
        // Ajouter une classe pour le navigateur
        document.documentElement.classList.add(`browser-${browser.name.toLowerCase()}`);
        
        // Ajouter une classe pour mobile
        if (isMobile) {
            document.documentElement.classList.add('mobile-device');
        }
        
        // Fixes spécifiques pour Safari
        if (browser.name === "Safari") {
            const style = document.createElement('style');
            style.textContent = `
                .dark-theme .header {
                    background-color: rgba(18, 18, 18, 0.95) !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Fixes spécifiques pour Firefox
        if (browser.name === "Firefox") {
            const style = document.createElement('style');
            style.textContent = `
                * {
                    scrollbar-width: thin;
                    scrollbar-color: var(--spotify-green) var(--dark-bg-tertiary);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Corrige les chemins des images pour GitHub Pages
     */
    function fixImagePaths() {
        // Correction des URL dans les balises image
        document.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            if (src && src.startsWith('/')) {
                img.setAttribute('src', src.substring(1));
            }
        });
        
        // Correction des URL dans les balises source de picture
        document.querySelectorAll('source').forEach(source => {
            const srcset = source.getAttribute('srcset');
            if (srcset && srcset.startsWith('/')) {
                source.setAttribute('srcset', srcset.substring(1));
            }
        });
        
        // Correction des URL dans les liens stylesheet
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('/')) {
                link.setAttribute('href', href.substring(1));
            }
        });
        
        // Correction des URL dans les balises script
        document.querySelectorAll('script').forEach(script => {
            const src = script.getAttribute('src');
            if (src && src.startsWith('/')) {
                script.setAttribute('src', src.substring(1));
            }
        });
    }
});

/**
 * Styles par défaut pour le bouton de basculement du thème
 */
const themeToggleStyles = document.createElement('style');
themeToggleStyles.textContent = `
    .theme-toggle-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #1DB954;
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        transition: all 0.3s ease;
    }
    
    .theme-toggle-btn:hover {
        transform: scale(1.1);
        background-color: #1ed760;
    }
    
    .dark-theme {
        --dark-bg: #121212;
        --dark-bg-secondary: #181818;
        --dark-bg-tertiary: #282828;
        --dark-text: #FFFFFF;
        --dark-text-secondary: rgba(255, 255, 255, 0.7);
        --dark-text-tertiary: rgba(255, 255, 255, 0.5);
        --dark-border: rgba(255, 255, 255, 0.1);
        --spotify-green: #1DB954;
        --spotify-green-hover: #1ed760;
        --spotify-green-active: #169c46;
        --spotify-black: #191414;
        --spotify-blue: #4382FF;
    }
    
    .dark-theme body {
        background-color: var(--dark-bg);
        color: var(--dark-text);
    }
    
    .dark-theme .header {
        background-color: rgba(18, 18, 18, 0.8);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--dark-border);
    }
    
    .dark-theme .footer {
        background-color: var(--dark-bg-secondary);
        color: var(--dark-text-tertiary);
    }
    
    .dark-theme .card, 
    .dark-theme .section-card {
        background-color: var(--dark-bg-secondary);
        border: 1px solid var(--dark-border);
    }
    
    .dark-theme .btn-primary {
        background: var(--spotify-green);
        color: white;
    }
    
    .dark-theme .btn-primary:hover {
        background: var(--spotify-green-hover);
    }
    
    @media (prefers-reduced-motion: reduce) {
        .theme-toggle-btn {
            transition: none;
        }
        .theme-toggle-btn:hover {
            transform: none;
        }
    }
`;
document.head.appendChild(themeToggleStyles);
