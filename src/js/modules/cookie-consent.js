'use strict';

export function initCookieConsent() {
  const cookieConsent = document.getElementById('cookie-consent');
  const acceptCookies = document.getElementById('accept-cookies');
  const rejectCookies = document.getElementById('reject-cookies');

  if (!cookieConsent || !acceptCookies || !rejectCookies) {
    return;
  }

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