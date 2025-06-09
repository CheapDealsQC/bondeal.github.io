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

// Mock Data
const MOCK_ORDERS = {
  // ... existing code ...
};

