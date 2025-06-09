'use strict';

/**
 * Fetches the admin password hash from the server configuration.
 * @returns {Promise<string|null>} The admin password hash or null if an error occurs.
 */
export async function getAdminHash() {
  try {
    // In a real production environment, you might want to add cache-busting headers
    const response = await fetch('/config.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Network response was not ok, status: ${response.status}`);
    }
    const config = await response.json();
    if (!config.adminPasswordHash) {
      throw new Error('Password hash not found in config file.');
    }
    return config.adminPasswordHash;
  } catch (error) {
    console.error('Failed to load admin configuration:', error);
    alert('Erreur critique: Impossible de charger la configuration de sécurité. Veuillez contacter le support.');
    return null;
  }
}

/**
 * Hashes a password using SHA-256.
 * @param {string} pwd The password to hash.
 * @returns {Promise<string>} The hashed password.
 */
export async function hashPassword(pwd) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pwd));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Checks if the user is authenticated.
 * If not, redirects to the login page.
 * This function should be called at the beginning of any admin-only page script.
 */
export async function checkAuth() {
  const ADMIN_PASSWORD_HASH = await getAdminHash();
  if (!ADMIN_PASSWORD_HASH) {
    // getAdminHash already alerts the user of the critical error.
    // We stop execution here to prevent further script errors.
    // A full page redirect is safer to prevent any admin content from rendering.
    window.location.href = 'admin-login.html';
    return;
  }
  
  const storedHash = localStorage.getItem('adminPasswordHash');
  
  if (storedHash !== ADMIN_PASSWORD_HASH) {
    localStorage.removeItem('adminPasswordHash'); // Clean up invalid hashes
    window.location.href = 'admin-login.html';
  }
  // If hashes match, execution continues and the admin page loads normally.
}

/**
 * Logs the user out by clearing the stored hash and redirecting to the login page.
 */
export function logout() {
  localStorage.removeItem('adminPasswordHash');
  window.location.href = 'admin-login.html';
} 