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
  if (!orderForm) return;

  const orderBtn = document.getElementById('order-btn');
  const checkboxes = orderForm.querySelectorAll('.consent-checks input[type="checkbox"]');
  const emailInput = document.getElementById('cmd-email');
  const passwordInput = document.getElementById('cmd-password');

  const validate = () => {
    if (!orderBtn || !emailInput || !passwordInput) return;
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    const emailValid = emailInput.checkValidity() && emailInput.value.trim() !== '';
    const passwordValid = passwordInput.value.trim() !== '';
    orderBtn.disabled = !(allChecked && emailValid && passwordValid);
  };

  orderForm.addEventListener('input', validate);
  orderForm.addEventListener('change', validate); // For checkboxes

  validate(); // Initial check
}

export function initForms() {
  initHeroForm();
  initOrderForm();
} 