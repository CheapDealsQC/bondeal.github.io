'use strict';

import { initCookieConsent } from './modules/cookie-consent.js';
import { initFeatureSlider } from './modules/feature-slider.js';
import { initForms } from './modules/forms.js';
import { initUI } from './modules/ui.js';
import { initTracking } from './modules/tracking.js';
import { initScrollReveal } from './modules/animations.js';

document.addEventListener('DOMContentLoaded', () => {
  initCookieConsent();
  initFeatureSlider();
  initForms();
  initUI();
  initTracking();
  initScrollReveal();
});

// Gestion du formulaire de commande
document.addEventListener('DOMContentLoaded', function() {
  // Cache DOM elements
  const orderForm = document.getElementById('order-form');
  const orderBtn = document.getElementById('order-btn');
  const checkboxes = document.querySelectorAll('.consent-checks input[type="checkbox"]');
  const signupForm = document.getElementById('signup-form');
  const heroEmail = document.getElementById('hero-email');
  const heroPassword = document.getElementById('hero-password');
  const cmdEmail = document.getElementById('cmd-email');
  const cmdPassword = document.getElementById('cmd-password');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const faqItems = document.querySelectorAll('.faq-item');
  const cookieConsent = document.getElementById('cookie-consent');
  const acceptCookies = document.getElementById('accept-cookies');
  const rejectCookies = document.getElementById('reject-cookies');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');
  const backToTop = document.getElementById('back-to-top');
  const featureSlider = document.querySelector('.feature-slider');
  const themeToggle = document.getElementById('theme-toggle');
  const trackSection = document.getElementById('order-tracking');

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
      const email = emailInput.value;
      const password = passwordInput.value;

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
  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const hE = heroEmail.value.trim();
      const hP = heroPassword.value.trim();
      if (!hE || !hP) return;
      sessionStorage.setItem('spotifyEmail', hE);
      sessionStorage.setItem('spotifyPassword', hP);
      window.location.href = 'paiement.html';
    });
  }

  // Commander → Paiement
  if (cmdEmail && cmdPassword && orderBtn) {
    function valC() { 
      orderBtn.disabled = !(cmdEmail.checkValidity() && cmdPassword.value.trim()); 
    }
    cmdEmail.addEventListener('input', valC);
    cmdPassword.addEventListener('input', valC);
    orderBtn.addEventListener('click', () => {
      sessionStorage.setItem('spotifyEmail', cmdEmail.value);
      sessionStorage.setItem('spotifyPassword', cmdPassword.value);
      window.location.href = 'paiement.html';
    });
  }

  // FAQ accordéon
  faqItems.forEach(i => {
    i.querySelector('h4').addEventListener('click', () => i.classList.toggle('open'));
  });

  // Cookie Consent
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
  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }

  // Back to Top Button
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
    else if (step === 5) percent = 100;
    
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
  window.updateProgressBar = updateProgressBar;

  // Theme Toggle
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
  if (trackSection) {
    const trackOrderBtn = trackSection.querySelector('#track-order-btn');
    const orderNumberInput = trackSection.querySelector('#order-number');
    const trackingResult = trackSection.querySelector('.tracking-result');

    if (trackOrderBtn && orderNumberInput && trackingResult) {
      trackOrderBtn.addEventListener('click', () => {
        const orderNumber = orderNumberInput.value.trim();
        if (!orderNumber) return;

      // NOTE: The following is mock data for demonstration purposes.
      // In a real application, this would be an API call to a backend service.

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
      
      // Simuler la progression de la barre de statut
      const updateTimeline = () => {
        const steps = trackingResult.querySelectorAll('.timeline-item');
        let completedSteps = 1;

        if (Math.random() > 0.3) { // Simuler la confirmation du paiement
          steps[1].classList.add('completed');
          completedSteps++;
        }
        if (Math.random() > 0.6) { // Simuler la vérification
          steps[2].classList.add('completed');
          completedSteps++;
        }
        // ... etc.
      };

      const simulateProgress = () => {
        let currentStep = 1;
        updateProgressBar(currentStep);
        const interval = setInterval(() => {
          currentStep++;
          if (currentStep > 5) {
            clearInterval(interval);
            return;
          }
          updateProgressBar(currentStep);
        }, 2000);
      };

      updateTimeline();
      simulateProgress(); // Démarrer la simulation
    });
    }
  }
});

