/**
 * Solution d'urgence pour le thème sombre SpotiDeals sur GitHub Pages
 * Juin 2025
 * 
 * Ce script contourne les problèmes de chargement en injectant directement
 * les styles dans la page au lieu de compter sur les fichiers CSS externes.
 */

(function() {
    // Injecter les styles du thème sombre directement dans la page
    const darkThemeStyles = `
        /* Base du thème sombre */
        :root {
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
            --dark-gradient-primary: linear-gradient(135deg, #1DB954, #169c46);
            --dark-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }
        
        /* Classe principale du thème sombre */
        .dark-theme {
            background-color: var(--dark-bg);
            color: var(--dark-text);
        }
        
        /* Header */
        .dark-theme .header {
            background-color: rgba(18, 18, 18, 0.8);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--dark-border);
        }
        
        .dark-theme .nav-links a {
            color: var(--dark-text-secondary);
        }
        
        .dark-theme .nav-links a:hover {
            color: var(--dark-text);
        }
        
        /* Boutons */
        .dark-theme .btn-primary {
            background: var(--spotify-green);
            color: white;
        }
        
        .dark-theme .btn-primary:hover {
            background: var(--spotify-green-hover);
        }
        
        /* Cartes et sections */
        .dark-theme .card, 
        .dark-theme .section-card {
            background-color: var(--dark-bg-secondary);
            border: 1px solid var(--dark-border);
            box-shadow: var(--dark-shadow);
        }
        
        /* Formulaires */
        .dark-theme input,
        .dark-theme select,
        .dark-theme textarea {
            background-color: var(--dark-bg-tertiary);
            color: var(--dark-text);
            border: 1px solid var(--dark-border);
        }
        
        .dark-theme input:focus,
        .dark-theme select:focus,
        .dark-theme textarea:focus {
            border-color: var(--spotify-green);
        }
        
        /* Footer */
        .dark-theme .footer {
            background-color: var(--dark-bg-secondary);
            color: var(--dark-text-tertiary);
        }
        
        /* Bouton de basculement du thème */
        .theme-toggle-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--dark-bg-secondary);
            color: var(--spotify-green);
            border: none;
            cursor: pointer;
            box-shadow: var(--dark-shadow);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
        }
        
        /* Témoignages */
        .dark-theme .testimonial-card {
            background-color: var(--dark-bg-secondary);
        }
        
        .dark-theme .testimonial-card:hover {
            background-color: var(--dark-bg-tertiary);
        }
    `;
    
    // Injecter les styles
    document.addEventListener('DOMContentLoaded', function() {
        // Ajouter les styles du thème sombre
        const styleEl = document.createElement('style');
        styleEl.textContent = darkThemeStyles;
        document.head.appendChild(styleEl);
        
        // Créer un bouton de basculement du thème
        const themeToggleBtn = document.createElement('button');
        themeToggleBtn.className = 'theme-toggle-btn';
        themeToggleBtn.innerHTML = '🌓';
        themeToggleBtn.setAttribute('aria-label', 'Basculer thème clair/sombre');
        themeToggleBtn.title = 'Basculer thème clair/sombre';
        document.body.appendChild(themeToggleBtn);
        
        // Fonctionnalité de bascule du thème
        themeToggleBtn.addEventListener('click', function() {
            document.documentElement.classList.toggle('dark-theme');
            
            // Sauvegarder la préférence
            const isDark = document.documentElement.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
        
        // Appliquer le thème sauvegardé ou selon les préférences système
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (savedTheme !== 'light' && prefersDark)) {
            document.documentElement.classList.add('dark-theme');
        }
        
        console.log('🎨 Solution d\'urgence du thème sombre chargée avec succès');
    });
})();
