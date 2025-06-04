const fs = require('fs');
const path = require('path');

describe('updateProgressBar', () => {
  beforeEach(() => {
    window.matchMedia = window.matchMedia || function() {
      return {
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn()
      };
    };
    document.body.innerHTML = `
      <div id="progress-bar-fill" style="width:0%"></div>
      <div class="step"></div>
      <div class="step"></div>
      <div class="step"></div>
      <div class="step"></div>
      <div class="step"></div>
    `;
    const script = fs.readFileSync(path.resolve(__dirname, '../js/main.js'), 'utf8');
    eval(script);
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  test('step 5 sets width to 100%', () => {
    window.updateProgressBar(5);
    const fill = document.getElementById('progress-bar-fill');
    expect(fill.style.width).toBe('100%');
  });
});
