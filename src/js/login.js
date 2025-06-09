'use strict';

import { getAdminHash, hashPassword } from './modules/auth.js';

/**
 * Initializes the login functionality.
 */
async function initLogin() {
  const loginBtn = document.getElementById('loginBtn');
  const passwordInput = document.getElementById('adminPwd');
  
  if (!loginBtn || !passwordInput) {
    console.error('Login form elements not found.');
    return;
  }

  const ADMIN_PASSWORD_HASH = await getAdminHash();
  
  // If config fails to load, the auth module already alerts the user.
  // We disable the button to prevent login attempts.
  if (!ADMIN_PASSWORD_HASH) {
    loginBtn.disabled = true;
    passwordInput.disabled = true;
    passwordInput.placeholder = 'Configuration error';
    return;
  }

  // Also check if already logged in on page load
  const storedHash = localStorage.getItem('adminPasswordHash');
  if (storedHash === ADMIN_PASSWORD_HASH) {
    window.location.href = 'admin.html';
    return; // Stop further execution
  }

  const handleLogin = async () => {
    const pwd = passwordInput.value.trim();
    if (!pwd) {
      alert('Veuillez entrer un mot de passe.');
      return;
    }
    
    const inputHash = await hashPassword(pwd);
    
    if (inputHash === ADMIN_PASSWORD_HASH) {
      localStorage.setItem('adminPasswordHash', inputHash);
      window.location.href = 'admin.html';
    } else {
      alert('Mot de passe incorrect.');
      passwordInput.value = ''; // Clear the input
    }
  };

  loginBtn.addEventListener('click', handleLogin);
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  });
}

// Initialize the login page functionality when the DOM is ready.
document.addEventListener('DOMContentLoaded', initLogin); 