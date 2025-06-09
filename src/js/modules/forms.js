'use strict';

function initHeroForm() {
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
}

function initOrderForm() {
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        const orderBtn = document.getElementById('order-btn');
        const checkboxes = document.querySelectorAll('.consent-checks input[type="checkbox"]');
        const emailInput = document.getElementById('cmd-email');
        const passwordInput = document.getElementById('cmd-password');

        const checkAllConsents = () => {
            const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
            orderBtn.disabled = !allChecked;
        };

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', checkAllConsents);
        });

        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!Array.from(checkboxes).every(checkbox => checkbox.checked)) {
                alert('Veuillez accepter tous les termes avant de continuer.');
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;

            if (!email || !password) {
                alert('Veuillez remplir tous les champs requis.');
                return;
            }

            sessionStorage.setItem('spotifyEmail', email);
            sessionStorage.setItem('spotifyPassword', password);
            window.location.href = 'paiement.html';
        });

        checkAllConsents();
    }
}

export function initForms() {
  initHeroForm();
  initOrderForm();
} 