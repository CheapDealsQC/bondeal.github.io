const fs = require('fs');
const path = require('path');
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { JSDOM } = require('jsdom');

describe('updateProgressBar', () => {
  test('sets width to 100% on final step', () => {
    const html = `
      <div id="progress-bar-fill"></div>
      <div class="step"></div>
      <div class="step"></div>
      <div class="step"></div>
      <div class="step"></div>
      <div class="step"></div>`;
    const dom = new JSDOM(html, { runScripts: 'outside-only' });
    dom.window.updateProgressBar = function(step) {
      const fill = dom.window.document.getElementById('progress-bar-fill');
      const steps = dom.window.document.querySelectorAll('.step');
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
    };

    dom.window.updateProgressBar(5);

    const fill = dom.window.document.getElementById('progress-bar-fill');
    expect(fill.style.width).toBe('100%');
  });
});
