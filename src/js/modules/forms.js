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

function initFormValidation() {
  const orderForm = document.querySelector('#orderForm');
  if (!orderForm) return;

  const submitButton = orderForm.querySelector('#submitOrder');
  const formStatus = orderForm.querySelector('#form-status');

  if (!submitButton || !formStatus) return;

  orderForm.addEventListener('input', () => {
    const isValid = orderForm.checkValidity();
    submitButton.disabled = !isValid;
  });

  // Accessibility: Announce status on attempt to click disabled button
  submitButton.parentElement.addEventListener('click', (e) => {
    if (submitButton.disabled && e.target === submitButton) {
        formStatus.textContent = 'Veuillez compléter tous les champs obligatoires pour continuer.';
        // Clear the message after a few seconds so it can be re-announced
        setTimeout(() => {
            formStatus.textContent = '';
        }, 3000);
    }
  });
}

export function initForms() {
  initHeroForm();
  initFormValidation();
} 