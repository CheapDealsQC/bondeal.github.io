'use strict';

function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');

  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }
}

function initBackToTop() {
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
}

function initFaqAccordion() {
  document.querySelectorAll('.faq-item').forEach(i => {
    i.querySelector('h4').addEventListener('click', () => i.classList.toggle('open'));
  });
}

function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.classList.toggle('light-theme', savedTheme === 'light');
    } else {
      document.body.classList.toggle('light-theme', !prefersDarkScheme.matches);
    }

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    prefersDarkScheme.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        document.body.classList.toggle('light-theme', !e.matches);
      }
    });
  }
}

export function initUI() {
  initMobileMenu();
  initBackToTop();
  initFaqAccordion();
  initThemeToggle();
} 