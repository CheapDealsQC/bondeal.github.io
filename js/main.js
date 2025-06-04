// Gestion du formulaire de commande
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('order-form');
    const orderBtn = document.getElementById('order-btn');
    const checkboxes = document.querySelectorAll('.consent-checks input[type="checkbox"]');

    // Fonction pour vérifier si toutes les cases sont cochées
    function checkAllConsents() {
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        orderBtn.disabled = !allChecked;
    }

    // Ajouter les écouteurs d'événements pour chaque checkbox
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', checkAllConsents);
    });

    // Gestion de la soumission du formulaire
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Vérifier à nouveau les consentements avant la soumission
            if (!Array.from(checkboxes).every(checkbox => checkbox.checked)) {
                alert('Veuillez accepter tous les termes avant de continuer.');
                return;
            }

            // Récupérer les valeurs du formulaire
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Validation basique
            if (!email || !password) {
                alert('Veuillez remplir tous les champs requis.');
                return;
            }

            // Redirection vers PayPal
            window.location.href = 'paiement.html';
        });
    }

    // Hero → Paiement
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', e => {
            e.preventDefault();
            const hE = document.getElementById('hero-email').value.trim();
            const hP = document.getElementById('hero-password').value.trim();
            if (!hE || !hP) return;
            sessionStorage.setItem('spotifyEmail', hE);
            sessionStorage.setItem('spotifyPassword', hP);
            window.location.href = 'paiement.html';
        });
    }

    // Commander → Paiement
    const cmdE = document.getElementById('cmd-email');
    const cmdP = document.getElementById('cmd-password');
    const oBtn = document.getElementById('order-btn');
    
    if (cmdE && cmdP && oBtn) {
        function valC() { 
            oBtn.disabled = !(cmdE.checkValidity() && cmdP.value.trim()); 
        }
        cmdE.addEventListener('input', valC);
        cmdP.addEventListener('input', valC);
        oBtn.addEventListener('click', () => {
            sessionStorage.setItem('spotifyEmail', cmdE.value);
            sessionStorage.setItem('spotifyPassword', cmdP.value);
            window.location.href = 'paiement.html';
        });
    }

    // FAQ accordéon
    document.querySelectorAll('.faq-item').forEach(i => {
        i.querySelector('h4').addEventListener('click', () => i.classList.toggle('open'));
    });

    // Cookie Consent
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptCookies = document.getElementById('accept-cookies');
    const rejectCookies = document.getElementById('reject-cookies');

    if (cookieConsent && acceptCookies && rejectCookies) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieConsent.style.display = 'block';
        }

        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieConsent.style.display = 'none';
        });

        rejectCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'rejected');
            cookieConsent.style.display = 'none';
        });
    }

    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Back to Top Button
    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Feature slider drag support
    const featureSlider = document.querySelector('.feature-slider');
    if (featureSlider) {
        const sliderTrack = featureSlider.querySelector('.feature-slide-track');
        let isDown = false;
        let startX;
        let scrollLeft;

        const startDrag = (x) => {
            isDown = true;
            featureSlider.classList.add('dragging');
            startX = x - featureSlider.offsetLeft;
            scrollLeft = featureSlider.scrollLeft;
        };

        const endDrag = () => {
            isDown = false;
            featureSlider.classList.remove('dragging');
        };

        const moveDrag = (x) => {
            if (!isDown) return;
            const walk = x - featureSlider.offsetLeft - startX;
            featureSlider.scrollLeft = scrollLeft - walk;
        };

        featureSlider.addEventListener('mousedown', e => startDrag(e.pageX));
        featureSlider.addEventListener('touchstart', e => startDrag(e.touches[0].pageX), {passive: true});
        window.addEventListener('mouseup', endDrag);
        featureSlider.addEventListener('touchend', endDrag);
        featureSlider.addEventListener('mousemove', e => moveDrag(e.pageX));
        featureSlider.addEventListener('touchmove', e => moveDrag(e.touches[0].pageX), {passive: true});
    }

    // Progress bar animation
    function updateProgressBar(step) {
        const fill = document.getElementById('progress-bar-fill');
        const steps = document.querySelectorAll('.step');
        if (!fill || !steps.length) return;

        let percent = 0;
        if (step === 1) percent = 0;
        else if (step === 2) percent = 20;
        else if (step === 3) percent = 40;
        else if (step === 4) percent = 60;
        else if (step === 5) percent = 80;
        
        fill.style.width = percent + '%';
        
        steps.forEach((s, index) => {
            const stepNum = index + 1;
            s.classList.remove('active', 'completed');
            
            if (stepNum < step) {
                s.classList.add('completed');
            } else if (stepNum === step) {
                s.classList.add('active');
            }
        });
    }

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (themeToggle) {
        // Vérifier le thème sauvegardé
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.classList.toggle('light-theme', savedTheme === 'light');
        } else {
            document.body.classList.toggle('light-theme', !prefersDarkScheme.matches);
        }

        // Gérer le changement de thème
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });

        // Écouter les changements de préférence système
        prefersDarkScheme.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                document.body.classList.toggle('light-theme', !e.matches);
            }
        });
    }

    // Suivi de commande
    const trackOrderBtn = document.getElementById('track-order-btn');
    const orderNumberInput = document.getElementById('order-number');
    const trackingResult = document.querySelector('.tracking-result');

    if (trackOrderBtn && orderNumberInput && trackingResult) {
        trackOrderBtn.addEventListener('click', () => {
            const orderNumber = orderNumberInput.value.trim();
            if (!orderNumber) return;

            // Afficher le résultat
            trackingResult.style.display = 'block';

            // Simuler les données de la commande
            document.getElementById('result-order-number').textContent = orderNumber;
            document.getElementById('result-order-date').textContent = new Date().toLocaleDateString();
            document.getElementById('result-email').textContent = 'exemple@email.com';
            document.getElementById('result-amount').textContent = '82,62$ CAD';
            document.getElementById('result-payment-method').textContent = 'PayPal';
            document.getElementById('result-estimated-time').textContent = '3 à 5 jours ouvrables';

            // Simuler les dates de la timeline
            const now = new Date();
            document.getElementById('timeline-order-date').textContent = now.toLocaleString();
            document.getElementById('timeline-payment-date').textContent = new Date(now.getTime() + 1000 * 60 * 30).toLocaleString();
            document.getElementById('timeline-verification-date').textContent = new Date(now.getTime() + 1000 * 60 * 60).toLocaleString();
            document.getElementById('timeline-activation-date').textContent = 'En attente';
            document.getElementById('timeline-confirmation-date').textContent = 'En attente';

            // Simuler la progression
            let currentStep = 1;
            const timelineItems = document.querySelectorAll('.timeline-item');
            
            const updateTimeline = () => {
                timelineItems.forEach((item, index) => {
                    if (index < currentStep) {
                        item.classList.add('completed');
                    } else {
                        item.classList.remove('completed');
                    }
                });
            };

            // Simuler les mises à jour
            const simulateProgress = () => {
                if (currentStep < 3) {
                    currentStep++;
                    updateTimeline();
                    setTimeout(simulateProgress, 3000);
                }
            };

            updateTimeline();
            setTimeout(simulateProgress, 3000);
        });
    }
}); 